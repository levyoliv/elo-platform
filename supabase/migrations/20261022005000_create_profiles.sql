-- ELO - Estrutura inicial de autenticação
-- Esta migration deve ser aplicada em um banco novo.

-- 1. Tabela de perfis
create table public.profiles (
  id uuid primary key
    references auth.users(id) on delete cascade,
  full_name text not null,
  account_type text not null
    check (account_type in ('estudante', 'organizacao')),
  institution text,
  created_at timestamptz not null default now()
);

-- 2. Segurança em nível de linha
alter table public.profiles enable row level security;

-- 3. Permitir apenas leitura aos usuários autenticados
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

-- 4. Cada usuário só pode ler o próprio perfil
create policy "Visualizar proprio perfil"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

-- 5. Função privada para criar perfis automaticamente
create schema if not exists private;

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    account_type,
    institution
  )
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      'Usuário'
    ),
    case
      when new.raw_user_meta_data ->> 'account_type' = 'organizacao'
        then 'organizacao'
      else 'estudante'
    end,
    nullif(
      trim(new.raw_user_meta_data ->> 'institution'),
      ''
    )
  );

  return new;
end;
$$;

-- 6. Restringir a execução direta da função
revoke all on function private.handle_new_user()
from public, anon, authenticated;

-- 7. Criar perfil após o cadastro no Supabase Auth
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function private.handle_new_user();
