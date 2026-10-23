-- ELO - Políticas para exclusão lógica de oportunidades

-- 1. Somente oportunidades publicadas e não retiradas
-- ficam visíveis pela política pública.

alter policy "Visualizar oportunidades publicadas"
on public.opportunities
using (
  status = 'publicada'
  and deleted_at is null
);

-- 2. Organização pode alterar suas próprias oportunidades.
-- A retirada continua permitida mesmo se a organização
-- tiver perdido a verificação.
-- O gatilho protege os demais campos durante a retirada.

alter policy "Organizacao edita proprias oportunidades"
on public.opportunities
using (
  organizacao_id = (select auth.uid())
  and deleted_at is null
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.account_type = 'organizacao'
  )
)
with check (
  organizacao_id = (select auth.uid())
  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.account_type = 'organizacao'
  )
  and (
    status <> 'publicada'
    or deleted_at is not null
    or exists (
      select 1
      from public.organization_public_info info
      where info.organization_id = (select auth.uid())
        and info.verified = true
    )
  )
);

-- 3. Impedir novas candidaturas em oportunidades retiradas.

alter policy "Estudante cria candidatura"
on public.applications
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
      and o.deleted_at is null
  )
);
