
import { createClient } from "@/lib/supabase/server";

export async function listarOportunidades() {
  const supabase = await createClient();

  // Buscar oportunidades publicadas
  const { data, error } = await supabase
    .from("opportunities")
    .select(`
      id,
      organizacao_id,
      titulo,
      descricao,
      tipo,
      modalidade,
      localizacao,
      remuneracao,
      duracao,
      imagem_url,
      created_at
    `)
    .eq("status", "publicada")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Erro ao buscar oportunidades:", error.message);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Identificar as organizações responsáveis
  const idsOrganizacoes = [
    ...new Set(data.map((item) => item.organizacao_id)),
  ];

  const { data: organizacoes, error: erroOrganizacoes } =
    await supabase
      .from("organization_public_info")
      .select("organization_id, display_name")
      .in("organization_id", idsOrganizacoes);

  if (erroOrganizacoes) {
    console.error(
      "Erro ao buscar organizações:",
      erroOrganizacoes.message
    );
  }

  // Relacionar os nomes às oportunidades
  const nomes = new Map(
    (organizacoes ?? []).map((org) => [
      org.organization_id,
      org.display_name,
    ])
  );

  return data.map((item) => ({
    ...item,
    organizacao_nome:
      nomes.get(item.organizacao_id) ??
      "Organização não identificada",
  }));
}
