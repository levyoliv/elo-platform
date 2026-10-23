-- ELO - Cancelamento de candidaturas
-- quando uma oportunidade é retirada.

-- 1. Adicionar o status "cancelada".
alter table public.applications
drop constraint if exists applications_status_check;

alter table public.applications
add constraint applications_status_check
check (
  status in (
    'pendente',
    'aprovada',
    'rejeitada',
    'cancelada'
  )
);

-- 2. Função executada automaticamente na retirada.
create or replace function
public.cancel_withdrawn_opportunity_applications()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.deleted_at is null
     and new.deleted_at is not null then

    update public.applications
    set status = 'cancelada'
    where opportunity_id = new.id
      and status = 'pendente';

  end if;

  return new;
end;
$$;

-- A função deve ser executada pelo gatilho,
-- não diretamente pelos usuários da aplicação.
revoke all on function
public.cancel_withdrawn_opportunity_applications()
from public, anon, authenticated;

-- 3. Ativar o cancelamento automático.
drop trigger if exists
cancel_withdrawn_applications_trigger
on public.opportunities;

create trigger cancel_withdrawn_applications_trigger
after update of deleted_at
on public.opportunities
for each row
execute function
public.cancel_withdrawn_opportunity_applications();

-- 4. Corrigir candidaturas pendentes de oportunidades
-- que já foram retiradas nos nossos testes.
update public.applications a
set status = 'cancelada'
where a.status = 'pendente'
  and exists (
    select 1
    from public.opportunities o
    where o.id = a.opportunity_id
      and o.deleted_at is not null
  );

-- 5. Impedir decisões em oportunidades retiradas
-- ou que não estejam mais publicadas.
alter policy "Organizacao avalia candidaturas"
on public.applications
using (
  status = 'pendente'
  and exists (
    select 1
    from public.opportunities o
    where o.id = opportunity_id
      and o.organizacao_id = (select auth.uid())
      and o.status = 'publicada'
      and o.deleted_at is null
  )
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.account_type = 'organizacao'
  )
)
with check (
  status in ('aprovada', 'rejeitada')
  and exists (
    select 1
    from public.opportunities o
    where o.id = opportunity_id
      and o.organizacao_id = (select auth.uid())
      and o.status = 'publicada'
      and o.deleted_at is null
  )
);
