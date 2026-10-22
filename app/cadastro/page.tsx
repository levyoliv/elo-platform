
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { cadastrarUsuario } from "@/lib/auth/cadastro";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  GraduationCap,
  Building2,
} from "lucide-react";

type ProfileType = "estudante" | "organizacao";

export default function CadastroPage() {
  const [profile, setProfile] =
    useState<ProfileType>("estudante");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCadastro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setMessage("");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    const nome = String(formData.get("name") ?? "").trim();
    const institution = String(formData.get("institution") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const senha = String(formData.get("password") ?? "");
    const confirmarSenha = String(formData.get("confirmPassword") ?? "");

    if (!nome || !institution || !email || !senha || !confirmarSenha) {
      setErrorMessage("Preencha todos os campos obrigatórios.");
      return;
    }

    if (senha.length < 8) {
      setErrorMessage("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await cadastrarUsuario({
        nome,
        institution,
        email,
        senha,
        tipoConta: profile,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setMessage(
        "Solicitação recebida! Se necessário, confira seu e-mail para confirmar a conta."
      );
    } catch {
      setErrorMessage(
        "Não foi possível realizar o cadastro. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh justify-center bg-white px-5 py-6 sm:items-center sm:bg-[#F3F4F6] sm:py-10">
      <div className="flex w-full max-w-[400px] flex-col bg-white sm:rounded-[28px] sm:border sm:border-slate-200 sm:px-7 sm:py-7 sm:shadow-sm">

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
            Crie sua conta
          </h1>

          <p className="mt-1 text-center text-[12px] text-slate-500">
            Comece sua jornada com o ELO
          </p>
        </div>

        {/* Tipo de cadastro */}
        <div className="mt-7">
          <p className="mb-3 text-[13px] font-semibold text-[#0F2937]">
            Como deseja participar?
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-pressed={profile === "estudante"}
              onClick={() => setProfile("estudante")}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 transition ${
                profile === "estudante"
                  ? "border-[#0D9488] bg-teal-50 text-teal-700"
                  : "border-slate-200 bg-white text-slate-500 hover:border-teal-200"
              }`}
            >
              <GraduationCap size={25} strokeWidth={1.8} />

              <span className="text-[12px] font-semibold">
                Sou estudante
              </span>
            </button>

            <button
              type="button"
              aria-pressed={profile === "organizacao"}
              onClick={() => setProfile("organizacao")}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 transition ${
                profile === "organizacao"
                  ? "border-[#0D9488] bg-teal-50 text-teal-700"
                  : "border-slate-200 bg-white text-slate-500 hover:border-teal-200"
              }`}
            >
              <Building2 size={25} strokeWidth={1.8} />

              <span className="text-[12px] font-semibold">
                Sou organização
              </span>
            </button>
          </div>
        </div>

        {/* Formulário */}
        <form
          className="mt-7 space-y-4"
          onSubmit={handleCadastro}
        >
          {/* Nome */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-[13px] font-semibold text-[#0F2937]"
            >
              {profile === "estudante"
                ? "Nome completo"
                : "Nome da organização"}
            </label>

            <input
              key={`name-${profile}`}
              id="name"
              name="name"
              type="text"
              autoComplete={
                profile === "estudante"
                  ? "name"
                  : "organization"
              }
              placeholder={
                profile === "estudante"
                  ? "Digite seu nome completo"
                  : "Nome da organização"
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {/* Instituição */}
          <div>
            <label
              htmlFor="institution"
              className="mb-2 block text-[13px] font-semibold text-[#0F2937]"
            >
              {profile === "estudante"
                ? "Universidade"
                : "Tipo de organização"}
            </label>

            {profile === "estudante" ? (
              <input
                id="institution"
                name="institution"
                type="text"
                placeholder="Ex.: Universidade Federal do Ceará"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            ) : (
              <select
                id="institution"
                name="institution"
                defaultValue=""
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                <option value="" disabled>
                  Selecione o tipo
                </option>
                <option value="ong">ONG</option>
                <option value="empresa">Empresa</option>
                <option value="escola">Escola</option>
                <option value="universidade">
                  Universidade
                </option>
                <option value="outra">Outra</option>
              </select>
            )}
          </div>

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
                placeholder="Crie uma senha"
                autoComplete="new-password"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
                className="ml-2 text-slate-400 transition hover:text-teal-600"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Confirmar senha */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-[13px] font-semibold text-[#0F2937]"
            >
              Confirmar senha
            </label>

            <div className="flex h-12 items-center rounded-xl border border-slate-200 px-4 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword ? "text" : "password"
                }
                placeholder="Repita sua senha"
                autoComplete="new-password"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                aria-label={
                  showConfirmPassword
                    ? "Ocultar confirmação de senha"
                    : "Mostrar confirmação de senha"
                }
                className="ml-2 text-slate-400 transition hover:text-teal-600"
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Botão temporariamente desabilitado */}
          
          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-12 w-full rounded-xl bg-[#0D9488] text-[14px] font-semibold text-white transition hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-75"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>


        {errorMessage && (
            <p
              role="alert"
              className="text-center text-[12px] text-red-600"
            >
              {errorMessage}
            </p>
        )}

        {message && (
            <p
              role="status"
              className="text-center text-[12px] text-teal-700"
            >
              {message}
            </p>
        )}
        </form>

        {/* Link para login */}
        <p className="mt-8 text-center text-[12px] text-slate-400">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-medium text-slate-600 transition hover:text-teal-600"
          >
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
