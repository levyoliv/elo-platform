"use client";

import Image from "next/image";
import Link from "next/link";
import {
  House,
  Search,
  ClipboardList,
  Heart,
  MessageCircle,
  UserRound,
  Bell,
  ShieldCheck,
  CircleHelp,
} from "lucide-react";
import { usePathname } from "next/navigation";

const menu = [
  { nome: "Oportunidades", icone: Search },
  { nome: "Minhas candidaturas", icone: ClipboardList },
  { nome: "Favoritos", icone: Heart },
  { nome: "Mensagens", icone: MessageCircle },
  { nome: "Meu perfil", icone: UserRound },
];

const configuracoes = [
  { nome: "Notificações", icone: Bell },
  { nome: "Privacidade", icone: ShieldCheck },
  { nome: "Ajuda", icone: CircleHelp },
];

interface StudentSidebarProps {
  nome?: string;
}

export default function StudentSidebar({
  nome = "Estudante",
}: StudentSidebarProps) {
  const inicial = nome.trim().charAt(0).toUpperCase() || "E";
  const pathname = usePathname();
  return (
    <aside className="flex min-h-screen w-[235px] shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6">
      {/* Logo oficial */}
      <Link href="/" className="mb-10 px-3">
        <Image
          src="/images/logo-elo-sem-subtitulo.png"
          alt="ELO"
          width={110}
          height={42}
          className="h-auto w-[105px]"
        />
      </Link>

      {/* Navegação principal */}
      <nav className="space-y-1">
        <Link
          href="/painel/estudante"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition ${
            pathname === "/painel/estudante"
              ? "bg-teal-50 font-semibold text-[#0D9488]"
              : "text-slate-600 hover:bg-teal-50 hover:text-[#0D9488]"
          }`}
        >
          <House size={18} />
          Início
        </Link>

      {menu.map(({ nome, icone: Icone }) =>
        (nome === "Favoritos" || nome === "Minhas candidaturas") ? (
          <Link
            key={nome}
            href={
              nome === "Favoritos"
                ? "/painel/estudante/favoritos"
                : "/painel/estudante/candidaturas"
            }
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition ${
              pathname ===
                (nome === "Favoritos"
                  ? "/painel/estudante/favoritos"
                  : "/painel/estudante/candidaturas")
                ? "bg-teal-50 font-semibold text-[#0D9488]"
                : "text-slate-600 hover:bg-teal-50 hover:text-[#0D9488]"
            }`}
          >
            <Icone size={18} strokeWidth={1.8} />
            {nome}
          </Link>
        ) : (
          <div
            key={nome}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-slate-600"
          >
            <Icone size={18} strokeWidth={1.8} />
            {nome}
          </div>
        )
      )}
      </nav>

      {/* Configurações */}
      <div className="mt-9 border-t border-slate-100 pt-6">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Configurações
        </p>

        <div className="space-y-1">
          {configuracoes.map(({ nome, icone: Icone }) => (
            <div
              key={nome}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-slate-600"
            >
              <Icone size={18} strokeWidth={1.8} />
              {nome}
            </div>
          ))}
        </div>
      </div>
      
    {/* Perfil do estudante */}
    <div className="mt-auto border-t border-slate-100 pt-4">
    <div className="flex items-center gap-3 px-2 py-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[13px] font-bold text-[#0D9488]">
        {inicial}
        </div>

        <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-semibold text-[#1F2937]">
            {nome}
        </p>

        <p className="text-[11px] text-slate-400">
            Estudante
        </p>
        </div>
    </div>
    </div>

    </aside>
  );
}
