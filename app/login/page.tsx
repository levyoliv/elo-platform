
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { entrarUsuario } from "@/lib/auth/login";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "").trim();
    const senha = String(formData.get("password") ?? "");

    if (!email || !senha) {
      setErrorMessage("Preencha seu e-mail e sua senha.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await entrarUsuario({
        email,
        senha,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      // Redirecionamento temporário após login
      window.location.assign("/painel");
    } catch (error) {
      console.error("Erro ao entrar no ELO:", error);

      setErrorMessage(
        "Não foi possível realizar o login. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh justify-center bg-white px-5 py-6 sm:items-center sm:bg-[#F3F4F6] sm:py-10">
      <div className="flex w-full max-w-[380px] flex-col bg-white sm:min-h-[650px] sm:rounded-[28px] sm:border sm:border-slate-200 sm:px-7 sm:py-7 sm:shadow-sm">

        {/* Voltar */}
        <Link
          href="/"
          aria-label="Voltar ao início"
          className="flex w-fit items-center text-slate-800 transition hover:text-teal-600"
        >
          <ChevronLeft size={23} strokeWidth={1.8} />
        </Link>

        {/* Logo e apresentação */}
        <div className="mt-5 flex flex-col items-center">
          <Image
            src="/images/logo-elo-sem-subtitulo.png"
            alt="ELO"
            width={125}
            height={48}
            className="h-auto w-[115px]"
            priority
          />

          <h1 className="mt-5 text-center text-[20px] font-bold text-[#0F2937]">
            Bem-vindo de volta!
          </h1>

          <p className="mt-1 text-center text-[12px] text-slate-500">
            Entre na sua conta para continuar
          </p>
        </div>

        {/* Formulário */}
        <form
          className="mt-9 space-y-5"
          onSubmit={handleLogin}
        >
          {/* E-mail */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-[13px] font-semibold text-[#0F2937]"
            >
              E-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {/* Senha */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-[13px] font-semibold text-[#0F2937]"
            >
              Senha
            </label>

            <div className="flex h-12 items-center rounded-xl border border-slate-200 px-4 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Ocultar senha" : "Mostrar senha"
                }
                className="ml-2 text-slate-400 hover:text-teal-600"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>

            <div className="mt-3 text-right">
              <span className="text-[12px] font-medium text-[#0D9488]">
                Esqueci minha senha
              </span>
            </div>
          </div>

          {/* Botão de login */}
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-[#0D9488] text-[14px] font-semibold text-white transition hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-75"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {errorMessage && (
            <p
              role="alert"
              className="text-center text-[12px] text-red-600"
            >
              {errorMessage}
            </p>
          )}
        </form>

        {/* Divisor */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="whitespace-nowrap text-[11px] text-slate-400">
            ou continue com
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Login social */}
        <div className="space-y-2.5">
          <button
            type="button"
            disabled
            className="flex h-11 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-[12px] font-medium text-slate-700"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.28 5.48-4.78 7.18l7.73 6C44.4 38.03 46.98 31.88 46.98 24.55z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            Continuar com Google
          </button>

          <button
            type="button"
            disabled
            className="flex h-11 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-[12px] font-medium text-slate-700"
          >
            <span className="grid h-[17px] w-[17px] grid-cols-2 gap-[2px]">
              <span className="bg-[#F25022]" />
              <span className="bg-[#7FBA00]" />
              <span className="bg-[#00A4EF]" />
              <span className="bg-[#FFB900]" />
            </span>
            Continuar com Microsoft
          </button>
        </div>

        {/* Rodapé discreto */}
        <p className="mt-auto pt-12 text-center text-[12px] text-slate-400">
          Não tem uma conta?{" "}
          <Link
            href="/cadastro"
            className="font-medium text-slate-600 transition hover:text-teal-600"
          >
            Criar agora
          </Link>
        </p>
      </div>
    </main>
  );
}
