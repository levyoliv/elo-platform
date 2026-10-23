
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OrganizationDashboard from "@/components/dashboard/OrganizationDashboard";

async function ConteudoOrganizacao() {
  await connection();

  const supabase = await createClient();

  // Verificar se o usuário está autenticado
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  const usuarioId = data.claims.sub;

  // Verificar se a conta pertence a uma organização
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

  // Buscar apenas oportunidades desta organização
  const { data: oportunidades, error: erroOportunidades } =
    await supabase
      .from("opportunities")
      .select("id, titulo, status, created_at")
      .eq("organizacao_id", usuarioId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
  if (erroOportunidades) {
    throw new Error(
      "Não foi possível carregar as oportunidades da organização."
    );
  }

  // Consultar a verificação da organização
  const { data: informacoes, error: erroVerificacao } = await supabase
    .from("organization_public_info")
    .select("verified")
    .eq("organization_id", usuarioId)
    .maybeSingle();

  if (erroVerificacao) {
    throw new Error("Não foi possível verificar a organização.");
  }
  return (
    <OrganizationDashboard
      nome={perfil.full_name}
      oportunidades={oportunidades ?? []}
      verificada={informacoes?.verified === true}
    />
  );
} // ← ESTA chave estava faltando!

export default function OrganizacaoPage() {
  return (
    <Suspense fallback={<p>Carregando painel...</p>}>
      <ConteudoOrganizacao />
    </Suspense>
  );
}
