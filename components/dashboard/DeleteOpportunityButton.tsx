"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface DeleteOpportunityButtonProps {
  oportunidadeId: string;
}

export default function DeleteOpportunityButton({
  oportunidadeId,
}: DeleteOpportunityButtonProps) {
  const router = useRouter();

  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState("");

  async function excluirOportunidade() {
    if (excluindo) return;

    const confirmou = window.confirm(
      "Deseja retirar esta oportunidade?\n\n" +
        "Ela deixará de aparecer nas listagens, mas as candidaturas existentes serão preservadas."
    );

    if (!confirmou) return;

    setExcluindo(true);
    setErro("");

    try {
      const supabase = createClient();

      const { data: usuario, error: erroUsuario } =
        await supabase.auth.getUser();

      if (erroUsuario || !usuario.user) {
        setErro("Sua sessão expirou. Entre novamente.");
        return;
      }

      const { data: oportunidade, error } = await supabase
        .from("opportunities")
        .update({
          deleted_at: new Date().toISOString(),
        })
        .eq("id", oportunidadeId)
        .eq("organizacao_id", usuario.user.id)
        .is("deleted_at", null)
        .select("id")
        .single();

      if (error || !oportunidade) {
        throw error ?? new Error("Oportunidade não encontrada.");
      }

      router.refresh();
    } catch (error) {
      console.error("Erro ao retirar oportunidade:", error);

      setErro(
        "Não foi possível retirar esta oportunidade. Tente novamente."
      );
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={excluirOportunidade}
        disabled={excluindo}
        className="inline-flex items-center gap-1 text-[12px] font-medium text-red-600 transition hover:text-red-700 disabled:opacity-50"
      >
        <Trash2 size={13} />
        {excluindo ? "Excluindo..." : "Excluir"}
      </button>

      {erro && (
        <p role="alert" className="mt-1 text-[11px] text-red-600">
          {erro}
        </p>
      )}
    </div>
  );
}
