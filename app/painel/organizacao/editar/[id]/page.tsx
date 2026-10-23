import { Suspense } from "react";
import { connection } from "next/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import OrganizationSidebar from "@/components/dashboard/OrganizationSidebar";
import OrganizationOpportunityForm from "@/components/dashboard/OrganizationOpportunityForm";

interface EditarPageProps {
  params: Promise<{ id: string }>;
}

async function ConteudoEditar({
  params,
}: EditarPageProps) {
  await connection();

  const { id } = await params;

  const supabase = await createClient();

  // Conferir autenticação
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  const usuarioId = data.claims.sub;

  // Conferir se é uma organização
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

  // Buscar somente um rascunho da organização logada
  const { data: oportunidade, error: erroOportunidade } =
    await supabase
      .from("opportunities")
      .select(
        "id, titulo, descricao, tipo, modalidade, localizacao, remuneracao, duracao, status"
      )
      .eq("id", id)
      .eq("organizacao_id", usuarioId)
      .in("status", ["rascunho", "publicada"])
      .maybeSingle();
  if (erroOportunidade) {
    throw new Error("Não foi possível carregar o rascunho.");
  }

  if (!oportunidade) {
    notFound();
  }


  let edicaoBloqueada = false;
  let motivoBloqueio = "";

  if (oportunidade.status === "publicada") {
    // Verificar se existem candidaturas
    const { count, error: erroCandidaturas } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("opportunity_id", oportunidade.id);

    if (erroCandidaturas) {
      throw new Error("Não foi possível verificar as candidaturas.");
    }

    // Verificar se a organização está autorizada
    const { data: informacoes, error: erroVerificacao } = await supabase
      .from("organization_public_info")
      .select("verified")
      .eq("organization_id", usuarioId)
      .maybeSingle();

    if (erroVerificacao) {
      throw new Error("Não foi possível verificar a organização.");
    }

    if ((count ?? 0) > 0) {
      edicaoBloqueada = true;
      motivoBloqueio =
        "Esta oportunidade já recebeu candidaturas e não pode ser editada.";
    } else if (informacoes?.verified !== true) {
      edicaoBloqueada = true;
      motivoBloqueio =
        "Sua organização precisa estar verificada para editar esta publicação.";
    }
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
          Editar oportunidade
        </h1>

        <p className="mb-7 mt-1 text-[13px] text-slate-500">
          Atualize as informações do seu rascunho.
        </p>

        {edicaoBloqueada ? (
          <div className="max-w-3xl rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-sm font-semibold text-amber-900">
              Edição indisponível
            </h2>

            <p className="mt-2 text-[13px] text-amber-800">
              {motivoBloqueio}
            </p>
          </div>
        ) : (
          <OrganizationOpportunityForm oportunidade={oportunidade} />
        )}

      </main>
    </div>
  );
}

export default function EditarOportunidadePage({
  params,
}: EditarPageProps) {
  return (
    <Suspense fallback={<p>Carregando oportunidade...</p>}>
      <ConteudoEditar params={params} />
    </Suspense>
  );
}
