"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function atualizarVerificacao(
    formData: FormData
) {
    const organizationId = formData.get("organization_id");
    const verified = formData.get("verified");

    if (
        typeof organizationId !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(organizationId) ||
        (verified !== "true" && verified !== "false")
    ) {
        redirect("/painel/admin?erro=parametros");
    }

    const supabase = await createClient();

    const { data: authData, error: authError } =
        await supabase.auth.getClaims();

    const userId = authData?.claims?.sub;

    if (authError || !userId) {
        redirect("/painel/admin?erro=sessao");
    }

    // Segunda verificação de segurança na ação.
    const { data: admin, error: adminError } =
        await supabase
            .from("platform_admins")
            .select("user_id")
            .eq("user_id", userId)
            .maybeSingle();

    if (adminError || !admin) {
        redirect("/painel/admin?erro=permissao");
    }

    // A função do banco valida novamente a permissão
    // e registra a alteração no histórico.
    const { error } = await supabase.rpc(
        "set_organization_verification",
        {
            p_organization_id: organizationId,
            p_verified: verified === "true",
        }
    );

    if (error) {
        console.error(
            "Falha na verificacao de organizacao:",
            error.message
        );
        redirect("/painel/admin?erro=alteracao");
    }

    revalidatePath("/painel/admin");
    redirect("/painel/admin?sucesso=1");
}
