-- Part A: Add CHECK constraint to enforce valid notification type values.
-- To add a new type in the future: drop + recreate this constraint in a new migration.
ALTER TABLE push_notification_prefs
  ADD CONSTRAINT push_notification_prefs_type_check
  CHECK (notification_type IN ('inactive-users'));

-- Part B: Trigger function that creates default preference rows when a new profile is created.
-- SECURITY DEFINER is required because profiles are created by handle_new_user() which runs
-- as the function owner (not as the authenticated user), so auth.uid() is NULL at that point.
CREATE OR REPLACE FUNCTION create_default_push_notification_prefs()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO push_notification_prefs (profile_id, notification_type, enabled)
  VALUES (NEW.id, 'inactive-users', TRUE)
  ON CONFLICT (profile_id, notification_type) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_notification_prefs
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_default_push_notification_prefs();

-- Part C: Backfill existing users with default enabled preference rows.
INSERT INTO push_notification_prefs (profile_id, notification_type, enabled)
SELECT id, 'inactive-users', TRUE
FROM profiles
ON CONFLICT (profile_id, notification_type) DO NOTHING;
