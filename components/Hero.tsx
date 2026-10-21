
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  BriefcaseBusiness,
  HandHeart,
  Play,
  Sparkles,
} from "lucide-react";

const opportunities = [
  {
    title: "Projetos sociais",
    description: "Faça a diferença",
    icon: HandHeart,
    color: "border-teal-100 bg-teal-50 text-teal-600",
    lineColor: "bg-teal-400/40",
  },
  {
    title: "Oportunidades remuneradas",
    description: "Desenvolva sua carreira",
    icon: BriefcaseBusiness,
    color: "border-orange-100 bg-orange-50 text-orange-500",
    lineColor: "bg-orange-400/40",
  },
  {
    title: "Voluntariado",
    description: "Contribua com a comunidade",
    icon: Heart,
    color: "border-rose-100 bg-rose-50 text-rose-500",
    lineColor: "bg-rose-400/40",
  },
];

const avatars = [
  "https://i.pravatar.cc/80?img=47",
  "https://i.pravatar.cc/80?img=12",
  "https://i.pravatar.cc/80?img=44",
];

function OpportunityCard({
  opportunity,
}: {
  opportunity: (typeof opportunities)[number];
}) {
  const Icon = opportunity.icon;

  return (
    <div className="relative flex w-full items-center gap-3 overflow-hidden rounded-xl border border-slate-200/70 bg-white/95 px-3 py-2.5 shadow-[0_6px_20px_rgba(15,23,42,0.09)] backdrop-blur-sm">

      {/* Traço decorativo discreto */}
      <div
        className={`absolute right-3 top-0 h-[2px] w-12 rounded-full ${opportunity.lineColor}`}
      />

      {/* Ícone dentro do círculo */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${opportunity.color}`}
      >
        <Icon
          size={19}
          strokeWidth={2}
          fill={
            opportunity.title === "Voluntariado"
              ? "currentColor"
              : "none"
          }
        />
      </div>

      {/* Textos */}
      <div className="min-w-0">
        <p className="text-xs font-bold leading-snug text-slate-900 sm:text-[13px]">
          {opportunity.title}
        </p>

        <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
          {opportunity.description}
        </p>
      </div>
    </div>
  );
}

function StudentsCard() {
  return (
    <div className="w-fit rounded-xl border border-slate-200/70 bg-white/95 px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.12)] backdrop-blur-sm">

      {/* Detalhe superior */}
      <div className="mb-2 h-[2px] w-10 rounded-full bg-teal-400/40" />

      <p className="text-xl font-extrabold text-slate-900">
        +1.200
      </p>

      <p className="text-xs text-slate-500">
        estudantes conectados
      </p>

      {/* Fotos ilustrativas */}
      <div className="mt-2 flex -space-x-2">
        {avatars.map((avatar, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={avatar}
            src={avatar}
            alt={`Avatar ilustrativo ${index + 1}`}
            width={34}
            height={34}
            className="h-[34px] w-[34px] rounded-full border-2 border-white bg-slate-100 object-cover"
          />
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 lg:min-h-[630px] lg:grid-cols-2 lg:gap-8 lg:py-14">

        {/* Conteúdo esquerdo — preservado */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800">
            <Sparkles size={15} />
            Conectando universidades e comunidades
          </div>

          <h1 className="mt-7 max-w-xl text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-[52px]">
            Oportunidades que geram{" "}
            <span className="text-teal-600">
              impacto real.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
            O ELO conecta estudantes a projetos sociais e oportunidades
            profissionais em organizações verificadas. Desenvolva suas
            habilidades, contribua com a sociedade e construa seu futuro.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#oportunidades"
              className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              Explorar oportunidades
            </Link>

            <Link
              href="/#sobre"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              <Play size={16} fill="currentColor" />
              Como funciona
            </Link>
          </div>
        </div>

        {/* Composição visual — mantendo a versão que funcionou */}
        <div className="relative mx-auto w-full max-w-[590px]">
          <div className="relative h-[440px] sm:h-[520px]">

            {/* Fundo decorativo original */}
            <div className="absolute inset-x-2 bottom-5 top-5 overflow-hidden rounded-[4rem] border border-teal-100 bg-gradient-to-br from-[#e4f8f6] via-[#effaf9] to-white sm:inset-x-5">

              <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full border border-teal-200/60 bg-teal-200/35" />

              <div className="absolute -left-20 top-24 h-64 w-64 rounded-full border border-white/80 bg-white/25" />

              <div className="absolute right-10 top-20 h-28 w-28 rounded-full border border-teal-300/40" />

              <div className="absolute bottom-12 left-8 h-24 w-24 rounded-full border border-teal-200/50" />

              <div className="absolute bottom-16 right-8 h-px w-28 -rotate-[25deg] bg-teal-300/50" />
            </div>

            {/* Brilho */}
            <div className="absolute left-12 top-10 h-60 w-60 rounded-full bg-teal-200/35 blur-3xl" />

            {/* Estudante — mesmas proporções da versão boa */}
            <div className="absolute bottom-5 left-[-25px] z-10 h-[410px] w-[390px] sm:bottom-5 sm:-left-[70px] sm:h-[500px] sm:w-[550px] lg:-left-[75px] lg:w-[545px]">
              <Image
                src="/images/estudante-hero.png"
                alt="Estudante universitária representando as oportunidades do ELO"
                fill
                sizes="(max-width: 640px) 390px, 550px"
                className="object-contain object-bottom"
                priority
              />
            </div>

            {/* Cards compactos na lateral direita */}
            <div className="absolute right-0 top-[9%] z-20 hidden w-[210px] flex-col gap-3 sm:flex lg:w-[225px]">
              {opportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.title}
                  opportunity={opportunity}
                />
              ))}
            </div>

            {/* Card inferior com avatares */}
            <div className="absolute bottom-0 left-0 z-20 sm:bottom-2">
              <StudentsCard />
            </div>
          </div>

          {/* Cards abaixo da imagem no celular */}
          <div className="mt-5 grid gap-3 sm:hidden">
            {opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.title}
                opportunity={opportunity}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
