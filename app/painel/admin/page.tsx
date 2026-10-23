import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { atualizarVerificacao } from "./actions";
import Link from "next/link";

type Organization = {
    organization_id: string;
    display_name: string | null;
    verified: boolean;
};

type PageProps = {
    searchParams: Promise<{
        sucesso?: string;
        erro?: string;
    }>;
};

export default function AdminPage({
    searchParams,
}: PageProps) {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-slate-50 p-8">
                    <p className="text-slate-600">
                        Carregando painel administrativo...
                    </p>
                </main>
            }
        >
            <AdminContent searchParams={searchParams} />
        </Suspense>
    );
}

async function AdminContent({
    searchParams,
}: PageProps) {
    await connection();

    const parametros = await searchParams;
    const supabase = await createClient();

    const { data: authData } =
        await supabase.auth.getClaims();

    const userId = authData?.claims?.sub;

    if (!userId) {
        return (
            <MensagemAcesso
                titulo="Você precisa entrar na sua conta"
                descricao="Faça login para acessar a administração do ELO."
            />
        );
    }

    const { data: admin, error: adminError } =
        await supabase
            .from("platform_admins")
            .select("user_id")
            .eq("user_id", userId)
            .maybeSingle();

    if (adminError || !admin) {
        return (
            <MensagemAcesso
                titulo="Acesso restrito"
                descricao="Esta área é exclusiva dos administradores do ELO."
            />
        );
    }

    const { data, error } = await supabase.rpc(
        "list_admin_organizations"
    );

    const organizations: Organization[] =
        (data ?? []) as Organization[];

    const total = organizations.length;

    const verificadas = organizations.filter(
        (org) => org.verified
    ).length;

    const pendentes = total - verificadas;

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-8">
            <div className="mx-auto max-w-6xl space-y-8">
                <header className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
                        ELO · Administração
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight">
                        Gestão de organizações
                    </h1>

                    <p className="text-slate-600">
                        Verifique organizações e gerencie suas
                        permissões de publicação.
                    </p>


                    <div className="flex flex-wrap gap-3 pt-3">
                        <Link
                            href="/painel/admin/historico"
                            className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
                        >
                            Ver histórico de verificações
                        </Link>

                        <Link
                            href="/"
                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Página inicial
                        </Link>
                    </div>

                </header>

                <section className="grid gap-4 sm:grid-cols-3">
                    <Resumo titulo="Organizações" valor={total} />
                    <Resumo
                        titulo="Verificadas"
                        valor={verificadas}
                    />
                    <Resumo
                        titulo="Pendentes"
                        valor={pendentes}
                    />
                </section>

                {parametros.sucesso === "1" && (
                    <div
                        role="status"
                        className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800"
                    >
                        Verificação atualizada com sucesso.
                    </div>
                )}

                {parametros.erro && (
                    <div
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                    >
                        Não foi possível concluir a operação.
                        Confira sua sessão e suas permissões.
                    </div>
                )}

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-6">
                        <h2 className="text-lg font-semibold">
                            Organizações cadastradas
                        </h2>
                    </div>

                    {error ? (
                        <p className="p-6 text-sm text-red-700">
                            Não foi possível carregar as organizações.
                            Verifique a função administrativa no Supabase.
                        </p>
                    ) : organizations.length === 0 ? (
                        <p className="p-6 text-sm text-slate-600">
                            Nenhuma organização cadastrada.
                        </p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {organizations.map((org) => (
                                <div
                                    key={org.organization_id}
                                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0 space-y-2">
                                        <h3 className="font-semibold text-slate-900">
                                            {org.display_name ||
                                                "Organização sem nome"}
                                        </h3>

                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${org.verified
                                                ? "bg-teal-50 text-teal-700"
                                                : "bg-amber-50 text-amber-700"
                                                }`}
                                        >
                                            {org.verified
                                                ? "Verificada"
                                                : "Pendente"}
                                        </span>
                                    </div>

                                    <form action={atualizarVerificacao}>
                                        <input
                                            type="hidden"
                                            name="organization_id"
                                            value={org.organization_id}
                                        />

                                        <input
                                            type="hidden"
                                            name="verified"
                                            value={org.verified ? "false" : "true"}
                                        />

                                        <button
                                            type="submit"
                                            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition hover:opacity-85 ${org.verified
                                                ? "border border-red-200 bg-red-50 text-red-700"
                                                : "bg-teal-600 text-white"
                                                }`}
                                        >
                                            {org.verified
                                                ? "Retirar verificação"
                                                : "Verificar organização"}
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

function Resumo({
    titulo,
    valor,
}: {
    titulo: string;
    valor: number;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
                {titulo}
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
                {valor}
            </p>
        </div>
    );
}

function MensagemAcesso({
    titulo,
    descricao,
}: {
    titulo: string;
    descricao: string;
}) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
            <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <h1 className="text-xl font-bold text-slate-900">
                    {titulo}
                </h1>

                <p className="mt-3 text-slate-600">
                    {descricao}
                </p>
            </div>
        </main>
    );
}
