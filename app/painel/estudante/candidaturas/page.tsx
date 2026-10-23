
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import StudentSidebar from "@/components/dashboard/StudentSidebar";

async function ConteudoCandidaturas() {
  await connection();

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  const usuarioId = data.claims.sub;

  const { data: perfil } = await supabase
    .from("profiles")
    .select("full_name, account_type")
    .eq("id", usuarioId)
    .single();

  if (perfil?.account_type !== "estudante") {
    redirect("/painel");
  }

  const { data: candidaturas, error: erroCandidaturas } =
    await supabase
      .from("applications")
      .select("id, opportunity_id, status, created_at")
      .eq("student_id", usuarioId)
      .order("created_at", { ascending: false });


  type DetalheOportunidade = {
    application_id: string;
    titulo: string;
    localizacao: string | null;
    retirada: boolean;
  };

  // Buscar detalhes das oportunidades do próprio estudante,
  // incluindo aquelas que foram retiradas pela organização.
  const { data: detalhes, error: erroDetalhes } = await supabase.rpc(
    "get_my_application_opportunity_details"
  );

  if (erroDetalhes) {
    throw new Error(
      "Não foi possível carregar os detalhes das candidaturas."
    );
  }

  const oportunidadesPorCandidatura = new Map<
    string,
    DetalheOportunidade
  >(
    (detalhes ?? []).map(
      (item: DetalheOportunidade): [string, DetalheOportunidade] => [
        item.application_id,
        item,
      ]
    )
  );

  const nomesStatus: Record<string, string> = {
    pendente: "Em análise",
    aprovada: "Aprovada",
    rejeitada: "Não selecionada",
    cancelada: "Cancelada",
  };

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
          Minhas candidaturas
        </h1>

        <p className="mt-1 text-[13px] text-slate-500">
          Acompanhe as oportunidades às quais você se candidatou.
        </p>

        {erroCandidaturas ? (
          <p role="alert" className="mt-7 text-sm text-red-600">
            Não foi possível carregar suas candidaturas.
          </p>
        ) : candidaturas && candidaturas.length > 0 ? (
          <div className="mt-7 space-y-4">
            {candidaturas.map((candidatura) => {
              const oportunidade = oportunidadesPorCandidatura.get(
                candidatura.id
              );

              return (
                <div
                  key={candidatura.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div>
                    <h2 className="text-[15px] font-semibold text-[#1F2937]">
                      {oportunidade?.titulo ??
                        "Oportunidade indisponível"}
                    </h2>

                    {oportunidade?.retirada && (
                      <p className="mt-2 text-[12px] font-medium text-amber-700">
                        Oportunidade retirada pela organização.
                        Sua candidatura permanece no histórico.
                      </p>
                    )}

                    <p className="mt-1 text-[12px] text-slate-500">
                      {oportunidade?.localizacao ??
                        "Localização não disponível"}
                    </p>

                    <p className="mt-2 text-[12px] text-slate-400">
                      Enviada em{" "}
                      {new Date(
                        candidatura.created_at
                      ).toLocaleDateString("pt-BR", {
                        timeZone: "America/Fortaleza",
                      })}
                    </p>
                  </div>


                  <span
                    className={`rounded-full px-3 py-1 text-[12px] font-semibold ${candidatura.status === "aprovada"
                        ? "bg-teal-50 text-[#0D9488]"
                        : candidatura.status === "cancelada"
                          ? "bg-red-50 text-red-700"
                          : candidatura.status === "rejeitada"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-amber-50 text-amber-700"
                      }`}
                  >
                    {nomesStatus[candidatura.status] ??
                      candidatura.status}
                  </span>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-7 flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center">
            <ClipboardList
              size={30}
              className="mb-4 text-[#0D9488]"
            />

            <h2 className="text-[16px] font-semibold text-[#1F2937]">
              Você ainda não possui candidaturas
            </h2>

            <p className="mt-2 text-[12px] text-slate-500">
              Explore as oportunidades e encontre seu próximo projeto.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CandidaturasPage() {
  return (
    <Suspense fallback={<p>Carregando candidaturas...</p>}>
      <ConteudoCandidaturas />
    </Suspense>
  );
}
