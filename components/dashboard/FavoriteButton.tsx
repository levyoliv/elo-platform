
"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface FavoriteButtonProps {
  oportunidadeId: string;
}

export default function FavoriteButton({
  oportunidadeId,
}: FavoriteButtonProps) {
  const [favorito, setFavorito] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function verificarFavorito() {
      const supabase = createClient();

      const { data: usuario } = await supabase.auth.getUser();

      if (!usuario.user) {
        if (ativo) setCarregando(false);
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select("opportunity_id")
        .eq("student_id", usuario.user.id)
        .eq("opportunity_id", oportunidadeId)
        .maybeSingle();

      if (ativo) {
        if (error) {
          setErro("Não foi possível verificar os favoritos.");
        } else {
          setFavorito(!!data);
        }

        setCarregando(false);
      }
    }

    void verificarFavorito();

    return () => {
      ativo = false;
    };
  }, [oportunidadeId]);

  async function alternarFavorito() {
    if (carregando) return;

    setCarregando(true);
    setErro("");

    try {
      const supabase = createClient();

      const { data: usuario, error: erroUsuario } =
        await supabase.auth.getUser();

      if (erroUsuario || !usuario.user) {
        setErro("Entre na sua conta para salvar favoritos.");
        return;
      }

      if (favorito) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("student_id", usuario.user.id)
          .eq("opportunity_id", oportunidadeId);

        if (error) throw error;

        setFavorito(false);
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({
            student_id: usuario.user.id,
            opportunity_id: oportunidadeId,
          });

        if (error) throw error;

        setFavorito(true);
      }
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
      setErro("Não foi possível atualizar o favorito.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="absolute right-3 top-3 z-10">
      <button
        type="button"
        onClick={alternarFavorito}
        disabled={carregando}
        aria-label={
          favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
        }
        aria-pressed={favorito}
        title={
          favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
        }
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-red-500 disabled:opacity-60"
      >
        <Heart
          size={19}
          fill={favorito ? "#EF4444" : "none"}
          color={favorito ? "#EF4444" : "currentColor"}
        />
      </button>

      {erro && (
        <p
          role="alert"
          className="mt-2 max-w-48 rounded-lg bg-white p-2 text-[11px] text-red-600 shadow-sm"
        >
          {erro}
        </p>
      )}
    </div>
  );
}
