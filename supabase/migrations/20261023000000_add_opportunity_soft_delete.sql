-- ELO - Preparação para exclusão lógica de oportunidades

alter table public.opportunities
add column if not exists deleted_at timestamptz;

create index if not exists
  idx_opportunities_active_organization
on public.opportunities (organizacao_id)
where deleted_at is null;