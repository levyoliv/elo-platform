import { BriefcaseBusiness, ArrowRight } from "lucide-react";
import StudentOpportunityCard from "./StudentOpportunityCard";
import type { Opportunity } from "@/types/opportunity";

interface StudentOpportunitiesProps {
  oportunidades?: Opportunity[];
  busca?: string;
  filtrosAtivos?: boolean;
}

export default function StudentOpportunities({
  oportunidades = [],
  busca = "",
  filtrosAtivos = false,
}: StudentOpportunitiesProps) {
  const pesquisando = busca.trim().length > 0 || filtrosAtivos;
  return (
    <section className="mt-8">
      {/* Título da seção */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#1F2937]">
            Oportunidades em destaque
          </h2>

          <p className="mt-1 text-[12px] text-slate-500">
            Descubra projetos e experiências para você.
          </p>
        </div>

        <span className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-[#0D9488]">
          Ver todas
          <ArrowRight size={15} />
        </span>
      </div>

      
    {/* Lista de oportunidades */}
    {oportunidades.length > 0 ? (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {oportunidades.map((oportunidade) => (
          <StudentOpportunityCard
            key={oportunidade.id}
            oportunidade={oportunidade}
          />
        ))}
      </div>
    ) : (
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
        <div className="mb-4 rounded-xl bg-teal-50 p-4 text-[#0D9488]">
          <BriefcaseBusiness size={28} strokeWidth={1.7} />
        </div>

        <h3 className="text-[15px] font-semibold text-[#1F2937]">
          {pesquisando
            ? "Nenhuma oportunidade encontrada"
            : "Novas oportunidades em breve!"}
        </h3>

        <p className="mt-2 max-w-sm text-[12px] leading-5 text-slate-500">
          {pesquisando
            ? "Tente pesquisar por outro termo ou organização."
            : "As oportunidades publicadas pelas organizações aparecerão aqui para você explorar."}
        </p>
      </div>
    )}

    </section>
  );
}
