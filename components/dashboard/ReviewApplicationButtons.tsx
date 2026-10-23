
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ReviewApplicationButtonsProps {
  candidaturaId: string;
}

export default function ReviewApplicationButtons({
  candidaturaId,
}: ReviewApplicationButtonsProps) {
  const router = useRouter();

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function avaliar(status: "aprovada" | "rejeitada") {
    if (salvando) return;

    const mensagem =
      status === "aprovada"
        ? "Deseja aprovar esta candidatura?"
        : "Deseja rejeitar esta candidatura?";

    if (!window.confirm(mensagem)) return;

    setSalvando(true);
    setErro("");

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", candidaturaId)
        .eq("status", "pendente")
        .select("id, status")
        .single();

      if (error || !data) {
        throw error ?? new Error("Candidatura não encontrada.");
      }

      // Atualizar a página com o novo status
      router.refresh();
    } catch (error) {
      console.error("Erro ao avaliar candidatura:", error);

      setErro(
        "Não foi possível avaliar esta candidatura. Atualize a página e tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={salvando}
          onClick={() => avaliar("aprovada")}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0D9488] px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-[#0F766E] disabled:opacity-50"
        >
          <CheckCircle2 size={15} />
          Aprovar
        </button>

        <button
          type="button"
          disabled={salvando}
          onClick={() => avaliar("rejeitada")}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <XCircle size={15} />
          Rejeitar
        </button>
      </div>

      {erro && (
        <p role="alert" className="text-[12px] text-red-600">
          {erro}
        </p>
      )}
    </div>
  );
}
