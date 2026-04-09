-- Fix: SECURITY DEFINER functions in Supabase run with search_path = '' (empty).
-- The previous version of this function used an unqualified table name which
-- PostgreSQL couldn't resolve. Recreating it with SET search_path = public and
-- a fully-qualified table reference.
CREATE OR REPLACE FUNCTION create_default_push_notification_prefs()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.push_notification_prefs (profile_id, notification_type, enabled)
  VALUES (NEW.id, 'inactive-users', TRUE)
  ON CONFLICT (profile_id, notification_type) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
