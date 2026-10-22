import { createClient } from "@/lib/supabase/client";

interface DadosLogin {
  email: string;
  senha: string;
}

export async function entrarUsuario({
  email,
  senha,
}: DadosLogin) {
  const supabase = createClient();

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });

  return { data, error };
}
