
import {
  BriefcaseBusiness,
  BadgeCheck,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";

const indicadores = [
  {
    titulo: "Oportunidades ativas",
    icone: BriefcaseBusiness,
  },
  {
    titulo: "Organizações verificadas",
    icone: BadgeCheck,
  },
  {
    titulo: "Candidaturas enviadas",
    icone: ClipboardList,
  },
  {
    titulo: "Entrevistas agendadas",
    icone: CalendarCheck,
  },
];

export default function StudentStats() {
  return (
    <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {indicadores.map(({ titulo, icone: Icone }) => (
        <div
          key={titulo}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="rounded-lg bg-teal-50 p-2.5 text-[#0D9488]">
              <Icone size={21} strokeWidth={1.8} />
            </div>

            <span className="text-[11px] text-slate-400">
              Em breve
            </span>
          </div>

          <p className="text-[22px] font-bold text-[#1F2937]">
            —
          </p>

          <p className="mt-1 text-[12px] text-slate-500">
            {titulo}
          </p>
        </div>
      ))}
    </section>
  );
}
