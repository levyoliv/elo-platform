"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface CloseOpportunityButtonProps {
    oportunidadeId: string;
}

export default function CloseOpportunityButton({
    oportunidadeId,
}: CloseOpportunityButtonProps) {
    const router = useRouter();

    const [encerrando, setEncerrando] = useState(false);
    const [erro, setErro] = useState("");

    async function encerrar() {
        if (encerrando) return;

        const confirmou = window.confirm(
            "Deseja encerrar esta oportunidade? Ela deixará de receber novas candidaturas."
        );

        if (!confirmou) return;

        setEncerrando(true);
        setErro("");

        try {
            const supabase = createClient();

            const { data, error: erroUsuario } =
                await supabase.auth.getUser();

            if (erroUsuario || !data.user) {
                setErro("Sua sessão expirou. Entre novamente.");
                return;
            }

            const { data: encerrada, error } = await supabase
                .from("opportunities")
                .update({ status: "encerrada" })
                .eq("id", oportunidadeId)
                .eq("organizacao_id", data.user.id)
                .eq("status", "publicada")
                .select("id")
                .single();

            if (error || !encerrada) {
                throw error ?? new Error("Oportunidade não encontrada.");
            }

            router.refresh();
        } catch (error) {
            console.error("Erro ao encerrar oportunidade:", error);
            setErro("Não foi possível encerrar a oportunidade.");
        } finally {
            setEncerrando(false);
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={encerrar}
                disabled={encerrando}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-orange-600 transition hover:text-orange-700 disabled:opacity-50"
            >
                <LockKeyhole size={13} />
                {encerrando ? "Encerrando..." : "Encerrar"}
            </button>

            {erro && (
                <p role="alert" className="mt-1 text-[11px] text-red-600">
                    {erro}
                </p>
            )}
        </div>
    );
}
