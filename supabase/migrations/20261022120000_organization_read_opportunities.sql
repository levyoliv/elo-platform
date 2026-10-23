-- ELO - Organização visualiza suas próprias oportunidades
-- Inclui publicadas, rascunhos e encerradas.

create policy "Organizacao visualiza proprias oportunidades"
on public.opportunities
for select
to authenticated
using (
  organizacao_id = (select auth.uid())
);
