
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import StudentOpportunityCard from "@/components/dashboard/StudentOpportunityCard";

import type { Opportunity } from "@/types/opportunity";

async function ConteudoFavoritos() {
  await connection();

  const supabase = await createClient();

  // Verificar autenticação
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  const usuarioId = data.claims.sub;

  // Verificar se é estudante
  const { data: perfil } = await supabase
    .from("profiles")
    .select("full_name, account_type")
    .eq("id", usuarioId)
    .single();

  if (perfil?.account_type !== "estudante") {
    redirect("/painel");
  }

  // Buscar os favoritos do estudante
  const { data: favoritos, error: erroFavoritos } = await supabase
    .from("favorites")
    .select("opportunity_id")
    .eq("student_id", usuarioId);

  if (erroFavoritos) {
    return <p>Não foi possível carregar seus favoritos.</p>;
  }

  const ids = (favoritos ?? []).map(
    (favorito) => favorito.opportunity_id
  );

  let oportunidades: Opportunity[] = [];

  if (ids.length > 0) {
    const { data: vagas, error: erroVagas } = await supabase
      .from("opportunities")
      .select("*")
      .in("id", ids)
      .eq("status", "publicada")
      .is("deleted_at", null);  

    if (erroVagas) {
      return <p>Não foi possível carregar as oportunidades.</p>;
    }

    const organizacoesIds = [
      ...new Set(
        (vagas ?? []).map((vaga) => vaga.organizacao_id)
      ),
    ];

    const { data: organizacoes } = await supabase
      .from("organization_public_info")
      .select("organization_id, display_name")
      .in("organization_id", organizacoesIds);

    const nomes = new Map(
      (organizacoes ?? []).map((org) => [
        org.organization_id,
        org.display_name,
      ])
    );

    oportunidades = (vagas ?? []).map((vaga) => ({
      id: vaga.id,
      titulo: vaga.titulo,
      organizacao:
        nomes.get(vaga.organizacao_id) ??
        "Organização não identificada",
      tipo: vaga.tipo as Opportunity["tipo"],
      modalidade: vaga.modalidade as Opportunity["modalidade"],
      localizacao: vaga.localizacao,
      descricao: vaga.descricao,
      remuneracao: vaga.remuneracao,
      duracao: vaga.duracao,
      imagemUrl: vaga.imagem_url,
    }));
  }

  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      <StudentSidebar nome={perfil.full_name} />

      <main className="min-w-0 flex-1 px-8 py-8">
        <Link
          href="/painel/estudante"
          className="mb-6 inline-flex items-center gap-2 text-[13px] text-[#0D9488]"
        >
          <ArrowLeft size={17} />
          Voltar ao início
        </Link>

        <h1 className="text-[24px] font-bold text-[#1F2937]">
          Meus favoritos
        </h1>

        <p className="mt-1 text-[13px] text-slate-500">
          Oportunidades que você salvou para acompanhar.
        </p>

        {oportunidades.length > 0 ? (
          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {oportunidades.map((oportunidade) => (
              <StudentOpportunityCard
                key={oportunidade.id}
                oportunidade={oportunidade}
              />
            ))}
          </div>
        ) : (
          <div className="mt-7 flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center">
            <Heart
              size={30}
              className="mb-4 text-[#0D9488]"
            />

            <h2 className="text-[16px] font-semibold text-[#1F2937]">
              Nenhum favorito encontrado
            </h2>

            <p className="mt-2 text-[12px] text-slate-500">
              Salve oportunidades para encontrá-las aqui.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function FavoritosPage() {
  return (
    <Suspense fallback={<p>Carregando favoritos...</p>}>
      <ConteudoFavoritos />
    </Suspense>
  );
}
