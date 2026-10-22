import { createClient } from "@/lib/supabase/client";

type TipoConta = "estudante" | "organizacao";

interface DadosCadastro {
  nome: string;
  institution: string;
  email: string;
  senha: string;
  tipoConta: TipoConta;
}

export async function cadastrarUsuario({
  nome,
  institution,
  email,
  senha,
  tipoConta,
}: DadosCadastro) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password: senha,
    options: {
      data: {
        full_name: nome.trim(),
        institution: institution.trim(),
        account_type: tipoConta,
      },
    },
  });

  return { data, error };
}
