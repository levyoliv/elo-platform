import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import { listarOportunidades } from "@/lib/opportunities/listar";
import type { Opportunity } from "@/types/opportunity";

async function AreaEstudante() {
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

  // Impede acesso de organizações ou perfis inválidos
  if (erroPerfil || perfil?.account_type !== "estudante") {
    redirect("/painel");
  }

  
  const dados = await listarOportunidades();

  const oportunidades: Opportunity[] = dados.map((item) => ({
    id: item.id,
    titulo: item.titulo,
    organizacao: item.organizacao_nome,
    tipo: item.tipo as Opportunity["tipo"],
    modalidade: item.modalidade as Opportunity["modalidade"],
    localizacao: item.localizacao,
    descricao: item.descricao,
    remuneracao: item.remuneracao,
    duracao: item.duracao,
    imagemUrl: item.imagem_url,
  }));

  return (
    <StudentDashboard
      nome={perfil.full_name}
      oportunidades={oportunidades}
    />
  );
}

export default function EstudantePage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <AreaEstudante />
    </Suspense>
  );
}
