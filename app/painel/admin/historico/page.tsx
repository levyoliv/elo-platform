import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
    ArrowLeft,
    CheckCircle2,
    ShieldCheck,
    ShieldX,
} from "lucide-react";

type Organizacao = {
    organization_id: string;
    display_name: string | null;
    verified: boolean;
};

type Registro = {
    id: number;
    organization_id: string;
    admin_id: string;
    previous_verified: boolean;
    new_verified: boolean;
    changed_at: string;
};

export default function HistoricoAdminPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-slate-50 p-8">
                    <p className="text-slate-600">
                        Carregando histórico...
                    </p>
                </main>
            }
        >
            <ConteudoHistorico />
        </Suspense>
    );
}

async function ConteudoHistorico() {
    await connection();

    const supabase = await createClient();

    const { data: authData, error: authError } =
        await supabase.auth.getClaims();

    const userId = authData?.claims?.sub;

    if (authError || !userId) {
        return (
            <MensagemAcesso mensagem="Entre na sua conta para continuar." />
        );
    }

    // Verificação de administrador no servidor.
    const { data: admin, error: adminError } =
        await supabase
            .from("platform_admins")
            .select("user_id")
            .eq("user_id", userId)
            .maybeSingle();

    if (adminError || !admin) {
        return (
            <MensagemAcesso mensagem="Esta área é exclusiva dos administradores do ELO." />
        );
    }

    // A própria política RLS também restringe
    // o histórico aos administradores.
    const { data: historico, error: erroHistorico } =
        await supabase
            .from("organization_verification_audit")
            .select(
                "id, organization_id, admin_id, previous_verified, new_verified, changed_at"
            )
            .order("changed_at", { ascending: false })
            .limit(50);

    const { data: organizacoes, error: erroOrganizacoes } =
        await supabase.rpc("list_admin_organizations");

    const registros: Registro[] =
        (historico ?? []) as Registro[];

    const listaOrganizacoes: Organizacao[] =
        (organizacoes ?? []) as Organizacao[];

    const nomesOrganizacoes = new Map(
        listaOrganizacoes.map((org) => [
            org.organization_id,
            org.display_name || "Organização sem nome",
        ])
    );

    const houveErro =
        Boolean(erroHistorico) ||
        Boolean(erroOrganizacoes);

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-8">
            <div className="mx-auto max-w-5xl space-y-8">
                <header className="space-y-5">
                    <Link
                        href="/painel/admin"
                        className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800"
                    >
                        <ArrowLeft size={17} />
                        Voltar ao painel administrativo
                    </Link>

                    <div className="space-y-2">
                        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                            ELO · Administração
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight">
                            Histórico de verificações
                        </h1>

                        <p className="text-sm text-slate-600">
                            Consulte as últimas 50 alterações
                            realizadas nas verificações de organizações.
                        </p>
                    </div>
                </header>

                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b border-slate-200 p-6">
                        <ShieldCheck
                            size={22}
                            className="text-teal-600"
                        />

                        <div>
                            <h2 className="font-semibold">
                                Registro de decisões
                            </h2>

                            <p className="text-xs text-slate-500">
                                As alterações são registradas no banco
                                de dados.
                            </p>
                        </div>
                    </div>

                    {houveErro ? (
                        <p className="p-6 text-sm text-red-700">
                            Não foi possível carregar o histórico.
                            Confira as permissões no Supabase.
                        </p>
                    ) : registros.length === 0 ? (
                        <p className="p-6 text-sm text-slate-600">
                            Nenhuma alteração registrada até o momento.
                        </p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {registros.map((registro) => {
                                const foiVerificada =
                                    registro.new_verified;

                                const nome =
                                    nomesOrganizacoes.get(
                                        registro.organization_id
                                    ) ?? "Organização não identificada";

                                return (
                                    <article
                                        key={registro.id}
                                        className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between"
                                    >
                                        <div className="flex gap-3">
                                            <div
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${foiVerificada
                                                        ? "bg-teal-50 text-teal-700"
                                                        : "bg-red-50 text-red-700"
                                                    }`}
                                            >
                                                {foiVerificada ? (
                                                    <CheckCircle2 size={20} />
                                                ) : (
                                                    <ShieldX size={20} />
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <h3 className="font-semibold">
                                                    {nome}
                                                </h3>

                                                <p className="text-sm text-slate-600">
                                                    {foiVerificada
                                                        ? "Organização verificada"
                                                        : "Verificação retirada"}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    Administrador:{" "}
                                                    {registro.admin_id.slice(0, 8)}...
                                                </p>
                                            </div>
                                        </div>

                                        <time
                                            dateTime={registro.changed_at}
                                            className="text-xs text-slate-500"
                                        >
                                            {new Intl.DateTimeFormat(
                                                "pt-BR",
                                                {
                                                    dateStyle: "short",
                                                    timeStyle: "short",
                                                    timeZone: "America/Fortaleza",
                                                }
                                            ).format(
                                                new Date(registro.changed_at)
                                            )}
                                        </time>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

function MensagemAcesso({
    mensagem,
}: {
    mensagem: string;
}) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
            <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <h1 className="text-xl font-bold text-slate-900">
                    Acesso restrito
                </h1>

                <p className="mt-3 text-slate-600">
                    {mensagem}
                </p>

                <Link
                    href="/"
                    className="mt-5 inline-block text-sm font-semibold text-teal-700"
                >
                    Voltar ao início
                </Link>
            </div>
        </main>
    );
}
