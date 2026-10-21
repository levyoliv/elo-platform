
import {
  UserRoundSearch,
  Building2,
  GraduationCap,
  HeartHandshake,
} from "lucide-react";

const benefits = [
  {
    title: "Para estudantes",
    description: "Encontre oportunidades",
    icon: UserRoundSearch,
  },
  {
    title: "Para organizações",
    description: "Divulgue seus projetos",
    icon: Building2,
  },
  {
    title: "Para universidades",
    description: "Fortaleça o impacto local",
    icon: GraduationCap,
  },
  {
    title: "Para a sociedade",
    description: "Mais educação e oportunidades",
    icon: HeartHandshake,
  },
];

export default function Benefits() {
  return (
    <section
      aria-label="Benefícios do ELO"
      className="bg-slate-50 px-6 pb-12"
    >
      <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200/70 bg-white px-5 py-6 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="flex items-center gap-3"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <Icon size={22} strokeWidth={2} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {benefit.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
