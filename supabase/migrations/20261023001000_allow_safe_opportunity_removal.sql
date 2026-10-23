-- ELO - Permitir retirada segura de oportunidades
-- sem apagar candidaturas existentes.

create or replace function public.protect_opportunity_updates()
returns trigger
language plpgsql
set search_path = ''
as $$
begin

  -- Não permitir alterar a identidade da oportunidade.
  if new.id is distinct from old.id
     or new.organizacao_id is distinct from old.organizacao_id
     or new.created_at is distinct from old.created_at then

    raise exception 'Dados de identificação não podem ser alterados.';
  end if;

  -- Uma oportunidade já retirada não pode ser modificada.
  if old.deleted_at is not null then
    raise exception 'Esta oportunidade já foi retirada.';
  end if;

  -- Retirada lógica: permitir somente alterar deleted_at.
  if new.deleted_at is not null then

    if (to_jsonb(new) - 'deleted_at')
       is distinct from
       (to_jsonb(old) - 'deleted_at') then

      raise exception
        'Não altere outros dados ao retirar uma oportunidade.';
    end if;

    -- Registrar a data real da retirada no servidor.
    new.deleted_at := now();

    return new;
  end if;

  -- Oportunidades encerradas só podem ser retiradas.
  if old.status = 'encerrada' then
    raise exception
      'Oportunidades encerradas não podem ser editadas.';
  end if;

  -- Regras para rascunhos.
  if old.status = 'rascunho' then

    if new.status not in ('rascunho', 'publicada') then
      raise exception 'Transição de status não permitida.';
    end if;

    -- Só organizações verificadas podem publicar.
    if new.status = 'publicada'
       and not exists (
         select 1
         from public.organization_public_info info
         where info.organization_id = old.organizacao_id
           and info.verified = true
       ) then

      raise exception
        'A organização precisa ser verificada para publicar.';
    end if;

  end if;

  -- Regras para oportunidades publicadas.
  if old.status = 'publicada' then

    if new.status not in ('publicada', 'encerrada') then
      raise exception 'Transição de status não permitida.';
    end if;

    -- Encerramento: somente o status pode mudar.
    if new.status = 'encerrada' then

      if (to_jsonb(new) - 'status')
         is distinct from
         (to_jsonb(old) - 'status') then

        raise exception
          'Não altere outros dados ao encerrar.';
      end if;

    -- Edição: bloquear caso existam candidaturas.
    elsif new is distinct from old
       and exists (
         select 1
         from public.applications a
         where a.opportunity_id = old.id
       ) then

      raise exception
        'Esta oportunidade possui candidaturas e não pode ser editada.';
    end if;

  end if;

  return new;
end;
$$;
