
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { sairUsuario } from "@/lib/auth/logout";

export default function AuthButtons() {
  const router = useRouter();

  const [autenticado, setAutenticado] =
    useState<boolean | null>(null);

  const [saindo, setSaindo] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let ativo = true;

    async function verificarUsuario() {
      const { data, error } = await supabase.auth.getUser();

      if (ativo) {
        setAutenticado(!error && !!data.user);
      }
    }

    void verificarUsuario();

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event, session) => {
        if (!ativo) return;

        if (event === "SIGNED_OUT") {
          setAutenticado(false);
        } else if (event === "SIGNED_IN") {
          setAutenticado(!!session);
        }
      });

    return () => {
      ativo = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    if (saindo) return;

    setSaindo(true);
    setErro("");

    try {
      const { error } = await sairUsuario();

      if (error) {
        setErro("Não foi possível sair. Tente novamente.");
        return;
      }

      setAutenticado(false);
      router.replace("/");
      router.refresh();
    } catch {
      setErro("Não foi possível sair. Tente novamente.");
    } finally {
      setSaindo(false);
    }
  }

  if (autenticado === null) {
    return <div className="flex items-center gap-3" />;
  }

  if (autenticado) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          onClick={handleLogout}
          disabled={saindo}
          className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-75"
        >
          {saindo ? "Saindo..." : "Sair"}
        </button>

        {erro && (
          <p role="alert" className="text-xs text-red-600">
            {erro}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
      >
        Entrar
      </Link>

      <Link
        href="/cadastro"
        className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
      >
        Criar conta
      </Link>
    </div>
  );
}
