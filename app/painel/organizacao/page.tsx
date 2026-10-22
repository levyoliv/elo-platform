
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function AreaOrganizacao() {
  await connection();

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  // Impede acesso sem login
  if (error || !data?.claims) {
    redirect("/login");
  }

  const { data: perfil, error: erroPerfil } = await supabase
    .from("profiles")
    .select("full_name, account_type")
    .eq("id", data.claims.sub)
    .single();

  // Apenas contas do tipo organização podem entrar
  if (erroPerfil || perfil?.account_type !== "organizacao") {
    redirect("/painel");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3F4F6] px-5">
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-[#0F2937]">
          Área da Organização
        </h1>

        <p className="mt-3 text-sm text-slate-600">
          Bem-vindo, {perfil.full_name}!
        </p>
      </div>
    </main>
  );
}

export default function OrganizacaoPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <AreaOrganizacao />
    </Suspense>
  );
}
