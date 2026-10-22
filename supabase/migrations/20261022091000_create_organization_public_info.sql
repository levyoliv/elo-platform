
-- ELO - Informações públicas das organizações

create table public.organization_public_info (
  organization_id uuid primary key
    references public.profiles(id) on delete cascade,

  display_name text not null,

  verified boolean not null default false,

  created_at timestamptz not null default now()
);

-- Ativar segurança
alter table public.organization_public_info
enable row level security;

-- Permitir somente leitura aos usuários autenticados
revoke all on public.organization_public_info
from anon, authenticated;

grant select on public.organization_public_info
to authenticated;

-- Informações públicas podem ser consultadas
-- por usuários autenticados
create policy "Ler informacoes publicas das organizacoes"
on public.organization_public_info
for select
to authenticated
using (true);
