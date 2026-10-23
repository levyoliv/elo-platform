import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import OrganizationSidebar from "@/components/dashboard/OrganizationSidebar";
import OrganizationOpportunityForm from "@/components/dashboard/OrganizationOpportunityForm";

async function ConteudoNovaOportunidade() {
  await connection();

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  const usuarioId = data.claims.sub;

  const { data: perfil, error: erroPerfil } = await supabase
    .from("profiles")
    .select("full_name, account_type")
    .eq("id", usuarioId)
    .single();

  if (erroPerfil || !perfil) {
    redirect("/painel");
  }

  if (perfil.account_type !== "organizacao") {
    redirect("/painel/estudante");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F6] md:flex-row">
      <OrganizationSidebar nome={perfil.full_name} />

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <Link
          href="/painel/organizacao"
          className="mb-6 inline-flex items-center gap-2 text-[13px] text-[#0D9488]"
        >
          <ArrowLeft size={17} />
          Voltar às oportunidades
        </Link>

        <h1 className="text-2xl font-bold text-[#1F2937]">
          Nova oportunidade
        </h1>

        <p className="mb-7 mt-1 text-[13px] text-slate-500">
          Preencha as informações e salve sua oportunidade
          como rascunho.
        </p>

        <OrganizationOpportunityForm />
      </main>
    </div>
  );
}

export default function NovaOportunidadePage() {
  return (
    <Suspense fallback={<p>Carregando formulário...</p>}>
      <ConteudoNovaOportunidade />
    </Suspense>
  );
}
