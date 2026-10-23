"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  ClipboardList,
  MessageSquare,
  Building2,
  Settings,
  CircleHelp,
} from "lucide-react";

interface OrganizationSidebarProps {
  nome: string;
}

const menu = [
  {
    nome: "Minhas oportunidades",
    icone: BriefcaseBusiness,
    href: "/painel/organizacao",
  },
  {
    nome: "Candidaturas",
    icone: ClipboardList,
    href: "/painel/organizacao/candidaturas",
  },
  {
    nome: "Mensagens",
    icone: MessageSquare,
    href: null,
  },
  {
    nome: "Minha organização",
    icone: Building2,
    href: null,
  },
];

export default function OrganizationSidebar({
  nome,
}: OrganizationSidebarProps) {
  const pathname = usePathname();
  const inicial = nome.trim().charAt(0).toUpperCase() || "O";

  const classeBase =
    "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition";

  function classeMenu(ativo: boolean) {
    return `${classeBase} ${ativo
        ? "bg-teal-50 font-semibold text-[#0D9488]"
        : "text-slate-600 hover:bg-teal-50 hover:text-[#0D9488]"
      }`;
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white p-4 md:min-h-screen md:w-60 md:border-b-0 md:border-r md:p-5">
      <Link href="/painel/organizacao" className="mb-8 block">
        <Image
          src="/images/logo-elo-sem-subtitulo.png"
          alt="ELO"
          width={112}
          height={44}
          className="h-auto w-28"
        />
      </Link>

      <nav className="space-y-1">
        <Link
          href="/painel/organizacao"
          className={classeMenu(false)}
        >
          <LayoutDashboard size={18} strokeWidth={1.8} />
          Início
        </Link>

        {menu.map(({ nome: item, icone: Icone, href }) => {
          const ativo =
            href === "/painel/organizacao"
              ? pathname === "/painel/organizacao" ||
              pathname.startsWith("/painel/organizacao/nova") ||
              pathname.startsWith("/painel/organizacao/editar/")
              : href !== null && pathname === href;

          return href ? (
            <Link
              key={item}
              href={href}
              className={classeMenu(ativo)}
            >
              <Icone size={18} strokeWidth={1.8} />
              {item}
            </Link>
          ) : (
            <div
              key={item}
              className={`${classeBase} cursor-default text-slate-400`}
            >
              <Icone size={18} strokeWidth={1.8} />
              {item}
            </div>
          );
        })}
      </nav>

      <div className="mt-7 border-t border-slate-100 pt-5">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Configurações
        </p>

        <div className="space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 text-[13px] text-slate-500">
            <Settings size={17} />
            Configurações
          </div>

          <div className="flex items-center gap-3 px-3 py-2 text-[13px] text-slate-500">
            <CircleHelp size={17} />
            Ajuda
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-[#0D9488]">
          {inicial}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold text-[#1F2937]">
            {nome}
          </p>
          <p className="text-[11px] text-slate-500">
            Organização
          </p>
        </div>
      </div>
    </aside>
  );
}