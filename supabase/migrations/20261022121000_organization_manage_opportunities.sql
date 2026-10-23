-- ELO - Permissões para criar e editar oportunidades

grant insert, update
on public.opportunities
to authenticated;

-- Criar oportunidades
create policy "Organizacao cria oportunidades"
on public.opportunities
for insert
to authenticated
with check (
  organizacao_id = (select auth.uid())

  and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.account_type = 'organizacao'
  )

  and (
    status = 'rascunho'
    or (
      status = 'publicada'
      and exists (
        select 1
        from public.organization_public_info info
        where info.organization_id = (select auth.uid())
          and info.verified = true
      )
    )
  )
);

-- Editar apenas oportunidades da própria organização
create policy "Organizacao edita proprias oportunidades"
on public.opportunities
for update
to authenticated
using (
  organizacao_id = (select auth.uid())

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
    or exists (
      select 1
      from public.organization_public_info info
      where info.organization_id = (select auth.uid())
        and info.verified = true
    )
  )
);
