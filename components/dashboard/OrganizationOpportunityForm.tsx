
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface OportunidadeParaEdicao {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  modalidade: string;
  localizacao: string;
  remuneracao: number | null;
  duracao: string | null;
  status: "rascunho" | "publicada";
}

interface OrganizationOpportunityFormProps {
  oportunidade?: OportunidadeParaEdicao;
}

export default function OrganizationOpportunityForm({
  oportunidade,
}: OrganizationOpportunityFormProps) {
  const router = useRouter();

  const [titulo, setTitulo] = useState(oportunidade?.titulo ?? "");
  const [descricao, setDescricao] = useState(
    oportunidade?.descricao ?? ""
  );
  const [tipo, setTipo] = useState(
    oportunidade?.tipo ?? "voluntariado"
  );
  const [modalidade, setModalidade] = useState(
    oportunidade?.modalidade ?? "presencial"
  );
  const [localizacao, setLocalizacao] = useState(
    oportunidade?.localizacao ?? ""
  );
  const [remuneracao, setRemuneracao] = useState(
    oportunidade?.remuneracao?.toString() ?? ""
  );
  const [duracao, setDuracao] = useState(
    oportunidade?.duracao ?? ""
  );

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function salvarRascunho(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (salvando) return;

    setSalvando(true);
    setErro("");

    try {
      const supabase = createClient();

      const { data, error: erroUsuario } =
        await supabase.auth.getUser();

      if (erroUsuario || !data.user) {
        setErro("Sua sessão expirou. Entre novamente.");
        return;
      }

      const dadosOportunidade = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        tipo,
        modalidade,
        localizacao: localizacao.trim(),
        remuneracao:
          tipo === "remunerada" && remuneracao !== ""
            ? Number(remuneracao)
            : null,
        duracao: duracao.trim() || null,
      };

      if (oportunidade) {
        // Editar apenas um rascunho da própria organização
        const { data: atualizada, error } = await supabase
          .from("opportunities")
          .update(dadosOportunidade)
          .eq("id", oportunidade.id)
          .eq("organizacao_id", data.user.id)
          .eq("status", oportunidade.status)
          .select("id")
          .single();

        if (error || !atualizada) {
          throw error ?? new Error("Rascunho não encontrado.");
        }
      } else {
        // Criar uma nova oportunidade como rascunho
        const { error } = await supabase
          .from("opportunities")
          .insert({
            ...dadosOportunidade,
            organizacao_id: data.user.id,
            status: "rascunho",
          });

        if (error) {
          throw error;
        }
      }

      // Redirecionar após criar ou editar
      router.push("/painel/organizacao");
      router.refresh();
    } catch (error) {
      console.error("Erro ao salvar oportunidade:", error);
      setErro(
        oportunidade
          ? "Não foi possível atualizar o rascunho."
          : "Não foi possível salvar o rascunho."
      );
    } finally {
      setSalvando(false);
    }
  }

  const classeCampo =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-[#1F2937] outline-none focus:border-[#0D9488]";

  const classeLabel =
    "mb-2 block text-sm font-medium text-[#1F2937]";

  return (
    <form
      onSubmit={salvarRascunho}
      className="max-w-3xl space-y-5 rounded-xl border border-slate-200 bg-white p-6"
    >
      <div>
        <label htmlFor="titulo" className={classeLabel}>
          Título da oportunidade *
        </label>
        <input
          id="titulo"
          className={classeCampo}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex.: Monitoria de Programação"
          required
          maxLength={150}
        />
      </div>

      <div>
        <label htmlFor="descricao" className={classeLabel}>
          Descrição *
        </label>
        <textarea
          id="descricao"
          className={classeCampo}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descreva as atividades e responsabilidades..."
          rows={5}
          required
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="tipo" className={classeLabel}>
            Tipo *
          </label>
          <select
            id="tipo"
            className={classeCampo}
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="voluntariado">Voluntariado</option>
            <option value="remunerada">Remunerada</option>
          </select>
        </div>

        <div>
          <label htmlFor="modalidade" className={classeLabel}>
            Modalidade *
          </label>
          <select
            id="modalidade"
            className={classeCampo}
            value={modalidade}
            onChange={(e) => setModalidade(e.target.value)}
          >
            <option value="presencial">Presencial</option>
            <option value="hibrido">Híbrido</option>
            <option value="remoto">Remoto</option>
          </select>
        </div>

        <div>
          <label htmlFor="localizacao" className={classeLabel}>
            Localização *
          </label>
          <input
            id="localizacao"
            className={classeCampo}
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
            placeholder="Ex.: Fortaleza - CE"
            required
          />
        </div>

        <div>
          <label htmlFor="duracao" className={classeLabel}>
            Duração
          </label>
          <input
            id="duracao"
            className={classeCampo}
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
            placeholder="Ex.: 3 meses"
          />
        </div>
      </div>

      {tipo === "remunerada" && (
        <div>
          <label htmlFor="remuneracao" className={classeLabel}>
            Remuneração (R$)
          </label>
          <input
            id="remuneracao"
            type="number"
            min="0"
            step="0.01"
            className={classeCampo}
            value={remuneracao}
            onChange={(e) => setRemuneracao(e.target.value)}
            placeholder="Ex.: 1200.00"
          />
        </div>
      )}

      {erro && (
        <p role="alert" className="text-sm text-red-600">
          {erro}
        </p>
      )}

      <div className="flex justify-end border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={salvando}
          className="flex items-center gap-2 rounded-lg bg-[#0D9488] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#0F766E] disabled:opacity-60"
        >
          <Save size={17} />
          {salvando
            ? "Salvando..."
            : oportunidade
              ? "Salvar alterações"
              : "Salvar rascunho"}
        </button>
      </div>
    </form>
  );
}
