-- ELO - Proteção de oportunidades publicadas

create or replace function public.protect_opportunity_updates()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- Oportunidades encerradas não podem ser alteradas
  if old.status = 'encerrada' then
    raise exception 'Oportunidades encerradas não podem ser editadas.';
  end if;

  if old.status = 'publicada' then

    -- Não permitir voltar uma publicação para rascunho
    if new.status not in ('publicada', 'encerrada') then
      raise exception 'Transição de status não permitida.';
    end if;

    -- Ao encerrar, somente o status pode mudar
    if new.status = 'encerrada' then
      if (to_jsonb(new) - 'status')
         is distinct from (to_jsonb(old) - 'status') then
        raise exception 'Não altere os dados ao encerrar uma oportunidade.';
      end if;

    -- Impedir alterações após receber candidaturas
    elsif exists (
      select 1
      from public.applications a
      where a.opportunity_id = old.id
    ) and new is distinct from old then
      raise exception
        'Esta oportunidade já possui candidaturas e não pode ser editada.';
    end if;

  end if;

  return new;
end;
$$;

drop trigger if exists protect_opportunity_updates_trigger
on public.opportunities;

create trigger protect_opportunity_updates_trigger
before update on public.opportunities
for each row
execute function public.protect_opportunity_updates();
