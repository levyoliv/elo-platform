-- ELO | Fase 4
-- Administração segura da verificação de organizações.

-- 1. Lista de usuários administradores.
-- Somente uma operação administrativa no banco
-- poderá adicionar alguém a essa tabela.

CREATE TABLE IF NOT EXISTS public.platform_admins (
  user_id uuid PRIMARY KEY
    REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_admins
ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.platform_admins
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON public.platform_admins
TO authenticated;

DROP POLICY IF EXISTS
"Administrador consulta seu proprio acesso"
ON public.platform_admins;

CREATE POLICY
"Administrador consulta seu proprio acesso"
ON public.platform_admins
FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));


-- 2. Histórico das decisões administrativas.

CREATE TABLE IF NOT EXISTS
public.organization_verification_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  organization_id uuid NOT NULL
    REFERENCES auth.users(id),
  admin_id uuid NOT NULL
    REFERENCES auth.users(id),
  previous_verified boolean NOT NULL,
  new_verified boolean NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS
organization_verification_audit_org_idx
ON public.organization_verification_audit (
  organization_id,
  changed_at DESC
);

ALTER TABLE public.organization_verification_audit
ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.organization_verification_audit
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON public.organization_verification_audit
TO authenticated;

DROP POLICY IF EXISTS
"Administradores consultam historico"
ON public.organization_verification_audit;

CREATE POLICY
"Administradores consultam historico"
ON public.organization_verification_audit
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.platform_admins a
    WHERE a.user_id = (SELECT auth.uid())
  )
);


-- 3. Função segura para verificar organizações.

CREATE OR REPLACE FUNCTION
public.set_organization_verification(
  p_organization_id uuid,
  p_verified boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_admin_id uuid;
  v_previous_verified boolean;
BEGIN
  v_admin_id := auth.uid();

  -- Somente usuários administradores.
  IF v_admin_id IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.platform_admins a
    WHERE a.user_id = v_admin_id
  ) THEN
    RAISE EXCEPTION 'Acesso administrativo negado'
      USING ERRCODE = '42501';
  END IF;

  IF p_organization_id IS NULL
     OR p_verified IS NULL THEN
    RAISE EXCEPTION 'Parametros invalidos';
  END IF;

  -- Confirmar que o alvo é uma organização.
  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = p_organization_id
      AND p.account_type = 'organizacao'
  ) THEN
    RAISE EXCEPTION 'Organizacao invalida';
  END IF;

  -- Bloquear a linha durante a alteração.
  SELECT info.verified
  INTO v_previous_verified
  FROM public.organization_public_info info
  WHERE info.organization_id = p_organization_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Organizacao nao encontrada';
  END IF;

  -- Não registrar uma decisão redundante.
  IF v_previous_verified = p_verified THEN
    RETURN;
  END IF;

  UPDATE public.organization_public_info
  SET verified = p_verified
  WHERE organization_id = p_organization_id;

  INSERT INTO public.organization_verification_audit (
    organization_id,
    admin_id,
    previous_verified,
    new_verified
  )
  VALUES (
    p_organization_id,
    v_admin_id,
    v_previous_verified,
    p_verified
  );
END;
$$;

-- Apenas usuários autenticados podem chamar a função.
-- A função ainda verifica se o usuário é administrador.

REVOKE ALL ON FUNCTION
public.set_organization_verification(uuid, boolean)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
public.set_organization_verification(uuid, boolean)
TO authenticated;
