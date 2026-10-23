-- ELO - Histórico das oportunidades
-- vinculadas às candidaturas do estudante.

create or replace function
public.get_my_application_opportunity_details()
returns table (
  application_id uuid,
  titulo text,
  localizacao text,
  retirada boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    a.id as application_id,
    o.titulo,
    o.localizacao,
    (o.deleted_at is not null) as retirada
  from public.applications a
  join public.opportunities o
    on o.id = a.opportunity_id
  where
    a.student_id = (select auth.uid());
$$;

-- Restringir quem pode executar a função.
revoke all on function
  public.get_my_application_opportunity_details()
from public, anon;

grant execute on function
  public.get_my_application_opportunity_details()
to authenticated;
