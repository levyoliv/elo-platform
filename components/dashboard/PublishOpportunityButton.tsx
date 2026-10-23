"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PublishOpportunityButtonProps {
    oportunidadeId: string;
    verificada: boolean;
}

export default function PublishOpportunityButton({
    oportunidadeId,
    verificada,
}: PublishOpportunityButtonProps) {
    const router = useRouter();
    const [publicando, setPublicando] = useState(false);
    const [erro, setErro] = useState("");

    async function publicar() {
        if (publicando || !verificada) return;

        const confirmou = window.confirm(
            "Deseja publicar esta oportunidade? Ela ficará visível para os estudantes."
        );

        if (!confirmou) return;

        setPublicando(true);
        setErro("");

        try {
            const supabase = createClient();

            const { data, error: erroUsuario } =
                await supabase.auth.getUser();

            if (erroUsuario || !data.user) {
                setErro("Sua sessão expirou. Entre novamente.");
                return;
            }

            const { data: publicada, error } = await supabase
                .from("opportunities")
                .update({ status: "publicada" })
                .eq("id", oportunidadeId)
                .eq("organizacao_id", data.user.id)
                .eq("status", "rascunho")
                .select("id")
                .single();

            if (error || !publicada) {
                throw error ?? new Error("Rascunho não encontrado.");
            }

            router.refresh();
        } catch (error) {
            console.error("Erro ao publicar oportunidade:", error);
            setErro("Não foi possível publicar esta oportunidade.");
        } finally {
            setPublicando(false);
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={publicar}
                disabled={!verificada || publicando}
                title={
                    verificada
                        ? "Publicar oportunidade"
                        : "Sua organização precisa ser verificada para publicar"
                }
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0D9488] transition hover:text-[#0F766E] disabled:cursor-not-allowed disabled:opacity-40"
            >
                <Send size={13} />
                {publicando ? "Publicando..." : "Publicar"}
            </button>

            {erro && (
                <p role="alert" className="mt-1 text-[11px] text-red-600">
                    {erro}
                </p>
            )}
        </div>
    );
}
