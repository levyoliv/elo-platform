
"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ApplicationButtonProps {
  oportunidadeId: string;
}

export default function ApplicationButton({
  oportunidadeId,
}: ApplicationButtonProps) {
  const [candidatado, setCandidatado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function verificarCandidatura() {
      const supabase = createClient();

      const { data: usuario, error: erroUsuario } =
        await supabase.auth.getUser();

      if (erroUsuario || !usuario.user) {
        if (ativo) {
          setErro("Não foi possível verificar sua conta.");
          setCarregando(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("applications")
        .select("id")
        .eq("student_id", usuario.user.id)
        .eq("opportunity_id", oportunidadeId)
        .maybeSingle();

      if (ativo) {
        if (error) {
          setErro("Não foi possível verificar sua candidatura.");
        } else {
          setCandidatado(Boolean(data));
        }

        setCarregando(false);
      }
    }

    void verificarCandidatura();

    return () => {
      ativo = false;
    };
  }, [oportunidadeId]);

  async function candidatar() {
    if (carregando || candidatado) return;

    setCarregando(true);
    setErro("");

    try {
      const supabase = createClient();

      const { data: usuario, error: erroUsuario } =
        await supabase.auth.getUser();

      if (erroUsuario || !usuario.user) {
        setErro("Faça login para se candidatar.");
        return;
      }

      const { error } = await supabase
        .from("applications")
        .insert({
          student_id: usuario.user.id,
          opportunity_id: oportunidadeId,
          status: "pendente",
        });

      if (error) {
        if (error.code === "23505") {
          setCandidatado(true);
          return;
        }

        throw error;
      }

      setCandidatado(true);
    } catch (error) {
      console.error("Erro ao enviar candidatura:", error);
      setErro("Não foi possível enviar sua candidatura.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={candidatar}
        disabled={carregando || candidatado}
        className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition ${
          candidatado
            ? "cursor-default bg-teal-50 text-[#0D9488]"
            : "bg-[#0D9488] text-white hover:bg-[#0F766E] disabled:opacity-60"
        }`}
      >
        {candidatado ? (
          <>
            <CheckCircle2 size={17} />
            Candidatura enviada
          </>
        ) : (
          <>
            <Send size={16} />
            {carregando ? "Verificando..." : "Candidatar-se"}
          </>
        )}
      </button>

      {erro && (
        <p role="alert" className="mt-2 text-[12px] text-red-600">
          {erro}
        </p>
      )}
    </div>
  );
}
