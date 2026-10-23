-- ELO | Fase 4
-- Consulta administrativa de organizações.

CREATE OR REPLACE FUNCTION
public.list_admin_organizations()
RETURNS TABLE (
  organization_id uuid,
  display_name text,
  verified boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Impedir consultas por usuários comuns.
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.platform_admins a
    WHERE a.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Acesso administrativo negado'
      USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    info.organization_id,
    info.display_name::text,
    info.verified
  FROM public.organization_public_info info
  ORDER BY
    info.verified ASC,
    info.display_name ASC;
END;
$$;

REVOKE ALL ON FUNCTION
public.list_admin_organizations()
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION
public.list_admin_organizations()
TO authenticated;
