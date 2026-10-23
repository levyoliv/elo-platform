import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import OrganizationSidebar from "@/components/dashboard/OrganizationSidebar";
import ReviewApplicationButtons from "@/components/dashboard/ReviewApplicationButtons";

async function ConteudoCandidaturas() {
    await connection();

    const supabase = await createClient();

    // Verificar autenticação
    const { data, error } = await supabase.auth.getClaims();

    if (error || !data?.claims) {
        redirect("/login");
    }

    const usuarioId = data.claims.sub;

    // Verificar se é uma organização
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

    // Buscar as oportunidades desta organização
    const { data: oportunidades, error: erroOportunidades } =
        await supabase
            .from("opportunities")
            .select("id, titulo")
            .eq("organizacao_id", usuarioId);

    if (erroOportunidades) {
        throw new Error("Não foi possível carregar as oportunidades.");
    }

    const ids = (oportunidades ?? []).map((item) => item.id);

    // Buscar candidaturas das oportunidades da organização
    const resultado = ids.length
        ? await supabase
            .from("applications")
            .select("id, opportunity_id, status, created_at")
            .in("opportunity_id", ids)
            .order("created_at", { ascending: false })
        : { data: [], error: null };

    if (resultado.error) {
        throw new Error("Não foi possível carregar as candidaturas.");
    }

    const candidaturas = resultado.data ?? [];

    // Buscar os nomes dos candidatos autorizados
    const { data: candidatos, error: erroCandidatos } =
        await supabase.rpc("list_organization_applicants");

    if (erroCandidatos) {
        throw new Error("Não foi possível carregar os nomes dos candidatos.");
    }

    const nomesCandidatos = new Map<string, string>(
        (candidatos ?? []).map(
            (candidato: {
                application_id: string;
                student_name: string;
            }): [string, string] => [
                    candidato.application_id,
                    candidato.student_name,
                ]
        )
    );


    const titulos = new Map(
        (oportunidades ?? []).map((item) => [
            item.id,
            item.titulo,
        ])
    );

    const nomesStatus: Record<string, string> = {
        pendente: "Em análise",
        aprovada: "Aprovada",
        rejeitada: "Não selecionada",
        cancelada: "Cancelada",
    };

    const coresStatus: Record<string, string> = {
        pendente: "bg-amber-50 text-amber-700",
        aprovada: "bg-teal-50 text-[#0D9488]",
        rejeitada: "bg-slate-100 text-slate-600",
        cancelada: "bg-red-50 text-red-700",
    };

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
                    Candidaturas recebidas
                </h1>

                <p className="mt-1 text-[13px] text-slate-500">
                    Acompanhe as inscrições nas oportunidades
                    da sua organização.
                </p>

                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-[13px] text-slate-500">
                        Total de candidaturas
                    </p>

                    <p className="mt-1 text-2xl font-bold text-[#1F2937]">
                        {candidaturas.length}
                    </p>
                </div>

                {candidaturas.length > 0 ? (
                    <div className="mt-6 space-y-3">
                        {candidaturas.map((candidatura) => (
                            <div
                                key={candidatura.id}
                                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5"
                            >
                                <div>
                                    <p className="text-[13px] font-semibold text-[#0D9488]">
                                        <span className="font-normal text-slate-500">
                                            Candidato:
                                        </span>{" "}
                                        {nomesCandidatos.get(candidatura.id) ?? "Nome indisponível"}
                                    </p>

                                    <h2 className="mt-1 text-[15px] font-semibold text-[#1F2937]">
                                        {titulos.get(candidatura.opportunity_id) ??
                                            "Oportunidade indisponível"}
                                    </h2>

                                    <p className="mt-2 text-[12px] text-slate-500">
                                        Recebida em{" "}
                                        {new Date(
                                            candidatura.created_at
                                        ).toLocaleDateString("pt-BR", {
                                            timeZone: "America/Fortaleza",
                                        })}
                                    </p>
                                </div>

                                <div className="flex flex-col items-start gap-3">
                                    <span
                                        className={`rounded-full px-3 py-1 text-[12px] font-semibold ${coresStatus[candidatura.status] ??
                                            "bg-slate-100 text-slate-600"
                                            }`}
                                    >
                                        {nomesStatus[candidatura.status] ??
                                            candidatura.status}
                                    </span>

                                    {candidatura.status === "pendente" && (
                                        <ReviewApplicationButtons
                                            candidaturaId={candidatura.id}
                                        />
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center">
                        <ClipboardList
                            size={30}
                            className="mb-3 text-[#0D9488]"
                        />

                        <h2 className="text-sm font-semibold text-[#1F2937]">
                            Nenhuma candidatura recebida
                        </h2>

                        <p className="mt-2 text-xs text-slate-500">
                            As inscrições nas oportunidades da sua
                            organização aparecerão aqui.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function CandidaturasOrganizacaoPage() {
    return (
        <Suspense fallback={<p>Carregando candidaturas...</p>}>
            <ConteudoCandidaturas />
        </Suspense>
    );
}
