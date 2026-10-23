-- ELO - Avaliação de candidaturas pelas organizações

-- Permitir atualização somente da coluna status.
-- As organizações não poderão alterar estudante,
-- oportunidade ou data da candidatura.

grant update (status)
on public.applications
to authenticated;

-- Uma organização só pode avaliar candidaturas
-- pendentes das suas próprias oportunidades.

create policy "Organizacao avalia candidaturas"
on public.applications
for update
to authenticated

using (
  status = 'pendente'

  and exists (
    select 1
    from public.opportunities o
    where o.id = opportunity_id
      and o.organizacao_id = (select auth.uid())
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
  )
);
