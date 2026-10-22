
-- ELO - Favoritos dos estudantes

create table public.favorites (
  student_id uuid not null
    references auth.users(id) on delete cascade,

  opportunity_id uuid not null
    references public.opportunities(id) on delete cascade,

  created_at timestamptz not null default now(),

  primary key (student_id, opportunity_id)
);

-- Ativar segurança
alter table public.favorites enable row level security;

-- Permissões para usuários autenticados
revoke all on public.favorites from anon, authenticated;

grant select, insert, delete
on public.favorites to authenticated;

-- Cada estudante visualiza seus próprios favoritos
create policy "Visualizar proprios favoritos"
on public.favorites
for select
to authenticated
using (student_id = (select auth.uid()));

-- Somente estudantes podem salvar oportunidades publicadas
create policy "Adicionar favoritos"
on public.favorites
for insert
to authenticated
with check (
  student_id = (select auth.uid())
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

-- Cada estudante pode remover seus próprios favoritos
create policy "Remover proprios favoritos"
on public.favorites
for delete
to authenticated
using (student_id = (select auth.uid()));
