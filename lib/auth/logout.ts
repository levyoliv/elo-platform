import { createClient } from "@/lib/supabase/client";

export async function sairUsuario() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  return { error };
}
