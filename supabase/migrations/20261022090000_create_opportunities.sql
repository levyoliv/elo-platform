-- ELO - Tabela de oportunidades

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),

  organizacao_id uuid not null
    references public.profiles(id),

  titulo text not null,
  descricao text not null,

  tipo text not null
    check (tipo in ('remunerada', 'voluntariado')),

  modalidade text not null
    check (modalidade in ('presencial', 'hibrido', 'remoto')),

  localizacao text not null,
  remuneracao numeric(12, 2)
    check (remuneracao >= 0),

  duracao text,
  imagem_url text,

  status text not null default 'rascunho'
    check (status in ('rascunho', 'publicada', 'encerrada')),

  created_at timestamptz not null default now()
);

-- Ativar a segurança
alter table public.opportunities
enable row level security;

-- Permitir apenas leitura pela API
revoke all on public.opportunities
from anon, authenticated;

grant select on public.opportunities
to authenticated;

-- Usuários logados visualizam apenas vagas publicadas
create policy "Visualizar oportunidades publicadas"
on public.opportunities
for select
to authenticated
using (status = 'publicada');

-- Índice para a listagem de oportunidades
create index opportunities_status_created_idx
on public.opportunities (status, created_at desc);
