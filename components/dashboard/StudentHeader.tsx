
import { Bell } from "lucide-react";

interface StudentHeaderProps {
  nome: string;
}

export default function StudentHeader({
  nome,
}: StudentHeaderProps) {
  const inicial = nome.trim().charAt(0).toUpperCase() || "E";

  return (
    <header className="flex items-center justify-between gap-4">
      {/* Saudação */}
      <div>
        <h1 className="text-[24px] font-bold text-[#1F2937]">
          Olá, {nome}! 👋
        </h1>

        <p className="mt-1 text-[13px] text-slate-500">
          Encontre oportunidades que combinam com você.
        </p>
      </div>

      {/* Notificações e perfil */}
      <div className="flex shrink-0 items-center gap-3">
        <div
          aria-label="Notificações em desenvolvimento"
          title="Notificações em desenvolvimento"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600"
        >
          <Bell size={19} strokeWidth={1.8} />
        </div>

        <div
          aria-label={`Perfil de ${nome}`}
          title={nome}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-[14px] font-bold text-[#0D9488]"
        >
          {inicial}
        </div>
      </div>
    </header>
  );
}
