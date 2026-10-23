
import {
  BriefcaseBusiness,
  Clock3,
  MapPin,
} from "lucide-react";
import type { Opportunity } from "@/types/opportunity";
import FavoriteButton from "./FavoriteButton";
import ApplicationButton from "./ApplicationButton";

interface StudentOpportunityCardProps {
  oportunidade: Opportunity;
}

export default function StudentOpportunityCard({
  oportunidade,
}: StudentOpportunityCardProps) {
  const remunerada = oportunidade.tipo === "remunerada";

  const modalidade =
    oportunidade.modalidade === "hibrido"
      ? "Híbrido"
      : oportunidade.modalidade === "remoto"
        ? "Remoto"
        : "Presencial";

  const valor =
    oportunidade.remuneracao !== null
      ? new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(oportunidade.remuneracao)
      : null;

  return (
    <article className="relative overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md">
    <FavoriteButton oportunidadeId={oportunidade.id} />
      {/* Imagem da oportunidade */}
      <div
        className="flex h-36 items-center justify-center bg-teal-50 bg-cover bg-center text-[#0D9488]"
        style={
          oportunidade.imagemUrl
            ? {
                backgroundImage: `url("${oportunidade.imagemUrl}")`,
              }
            : undefined
        }
        role="img"
        aria-label={`Imagem de ${oportunidade.titulo}`}
      >
        {!oportunidade.imagemUrl && (
          <BriefcaseBusiness size={30} strokeWidth={1.5} />
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <h3 className="text-[14px] font-bold text-[#1F2937]">
          {oportunidade.titulo}
        </h3>

        <p className="mt-1 text-[11px] text-slate-500">
          {oportunidade.organizacao}
        </p>

        {/* Etiquetas */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={`rounded-md px-2 py-1 text-[10px] font-semibold ${
              remunerada
                ? "bg-teal-100 text-teal-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {remunerada ? "Remunerada" : "Voluntariado"}
          </span>

          <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
            {modalidade}
          </span>
        </div>

        {/* Descrição */}
        <p className="mt-3 line-clamp-2 min-h-10 text-[11px] leading-5 text-slate-500">
          {oportunidade.descricao}
        </p>

        {/* Informações adicionais */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
          {valor && (
            <span className="font-semibold text-[#0D9488]">
              {valor}
            </span>
          )}

          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {oportunidade.localizacao}
          </span>

          {oportunidade.duracao && (
            <span className="flex items-center gap-1">
              <Clock3 size={13} />
              {oportunidade.duracao}
            </span>
          )}
        </div>
      </div>
      <div className="px-4 pb-4">
        <ApplicationButton oportunidadeId={oportunidade.id} />
      </div>
    </article>  
  );
}
