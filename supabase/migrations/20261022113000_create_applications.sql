
-- ELO - Candidaturas dos estudantes

create table public.applications (
  id uuid primary key default gen_random_uuid(),

  student_id uuid not null
    references public.profiles(id) on delete cascade,

  opportunity_id uuid not null
    references public.opportunities(id) on delete cascade,

  status text not null default 'pendente'
    check (status in ('pendente', 'aprovada', 'rejeitada')),

  created_at timestamptz not null default now(),

  unique (student_id, opportunity_id)
);

alter table public.applications enable row level security;

revoke all on public.applications from anon, authenticated;

grant select, insert on public.applications to authenticated;

-- O estudante visualiza suas candidaturas
create policy "Estudante visualiza candidaturas"
on public.applications
for select
to authenticated
using (student_id = (select auth.uid()));

-- Apenas estudantes podem se candidatar
-- a oportunidades publicadas
create policy "Estudante cria candidatura"
on public.applications
for insert
to authenticated
with check (
  student_id = (select auth.uid())
  and status = 'pendente'
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.account_type = 'estudante'
  )
  and exists (
    select 1
    from public.opportunities o
    where o.id = opportunity_id
      and o.status = 'publicada'
  )
);

-- A organização pode consultar as inscrições
-- recebidas em suas próprias oportunidades
create policy "Organizacao visualiza candidaturas"
on public.applications
for select
to authenticated
using (
  exists (
    select 1
    from public.opportunities o
    where o.id = opportunity_id
      and o.organizacao_id = (select auth.uid())
  )
);
