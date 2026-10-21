
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-6">
        
        {/* Logo oficial */}
        <Link href="/" aria-label="Página inicial do ELO">
          <Image
            src="/images/logo-elo-sem-subtitulo.png"
            alt="ELO"
            width={150}
            height={55}
            className="h-auto w-32 md:w-36"
            priority
          />
        </Link>

        {/* Menu de navegação */}
        <nav className="hidden items-center gap-7 lg:flex">
          <Link
            href="/#oportunidades"
            className="text-sm text-slate-600 transition hover:text-teal-600"
          >
            Oportunidades
          </Link>

          <Link
            href="/#organizacoes"
            className="text-sm text-slate-600 transition hover:text-teal-600"
          >
            Organizações
          </Link>

          <Link
            href="/#sobre"
            className="text-sm text-slate-600 transition hover:text-teal-600"
          >
            Como funciona
          </Link>

          <Link
            href="/#impacto"
            className="text-sm text-slate-600 transition hover:text-teal-600"
          >
            Impacto
          </Link>
        </nav>

        {/* Acesso à plataforma */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
          >
            Entrar
          </Link>

          <Link
            href="/cadastro"
            className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </header>
  );
}
