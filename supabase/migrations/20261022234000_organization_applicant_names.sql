-- ELO - Nomes dos candidatos para a organização

create or replace function public.list_organization_applicants()
returns table (
  application_id uuid,
  student_name text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    a.id as application_id,
    coalesce(
      nullif(trim(p.full_name), ''),
      'Estudante'
    ) as student_name
  from public.applications a
  join public.opportunities o
    on o.id = a.opportunity_id
  join public.profiles p
    on p.id = a.student_id
  where
    o.organizacao_id = (select auth.uid())
    and p.account_type = 'estudante'
    and exists (
      select 1
      from public.profiles org
      where org.id = (select auth.uid())
        and org.account_type = 'organizacao'
    );
$$;

-- Somente usuários autenticados podem executar.
-- A função verifica internamente a organização.

revoke all on function
  public.list_organization_applicants()
from public, anon;

grant execute on function
  public.list_organization_applicants()
to authenticated;
