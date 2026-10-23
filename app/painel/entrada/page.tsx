import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default function EntradaPainelPage() {
    return (
        <Suspense fallback={
            <main className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-slate-600">
                    Preparando seu painel...
                </p>
            </main>
        }>
            <IdentificarUsuario />
        </Suspense>
    );
}

async function IdentificarUsuario() {
    await connection();

    const supabase = await createClient();

    const { data: authData, error: authError } =
        await supabase.auth.getClaims();

    const userId = authData?.claims?.sub;

    if (authError || !userId) {
        redirect("/");
    }

    // 1. Administradores têm prioridade.
    const { data: admin, error: adminError } =
        await supabase
            .from("platform_admins")
            .select("user_id")
            .eq("user_id", userId)
            .maybeSingle();

    if (adminError) {
        throw new Error(
            "Não foi possível verificar as permissões administrativas."
        );
    }

    if (admin) {
        redirect("/painel/admin");
    }

    // 2. Identificar estudante ou organização.
    const { data: perfil, error: perfilError } =
        await supabase
            .from("profiles")
            .select("account_type")
            .eq("id", userId)
            .maybeSingle();

    if (perfilError) {
        throw new Error(
            "Não foi possível identificar o perfil."
        );
    }

    if (perfil?.account_type === "estudante") {
        redirect("/painel/estudante");
    }

    if (perfil?.account_type === "organizacao") {
        redirect("/painel/organizacao");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
            <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
                <h1 className="text-xl font-bold text-slate-900">
                    Perfil não identificado
                </h1>

                <p className="mt-3 text-slate-600">
                    Sua conta está autenticada, mas ainda não
                    possui um tipo de perfil reconhecido.
                </p>
            </div>
        </main>
    );
}
