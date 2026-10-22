import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function ConteudoProtegido() {
  await connection();

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  
  const { data: perfil, error: erroPerfil } = await supabase
    .from("profiles")
    .select("full_name, account_type")
    .eq("id", data.claims.sub)
    .single();

  if (erroPerfil || !perfil) {
    return (
        <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-red-600">
            Não foi possível carregar seu perfil.
        </p>
        </main>
    );
  }

  if (perfil.account_type === "estudante") {
    redirect("/painel/estudante");
  }

  if (perfil.account_type === "organizacao") {
    redirect("/painel/organizacao");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3F4F6] px-5">
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-[#0F2937]">
          Olá, {perfil.full_name}!
        </h1>

        <p className="mt-3 text-sm text-slate-600">
        Tipo de conta:{" "}
        {perfil.account_type === "estudante"
            ? "Estudante"
            : "Organização"}
        </p>
      </div>
    </main>
  );
}

export default function PainelPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F3F4F6]">
          <p className="text-sm text-slate-600">
            Carregando painel...
          </p>
        </main>
      }
    >
      <ConteudoProtegido />
    </Suspense>
  );
}
