CREATE TABLE notification_preferences (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id        UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notification_type TEXT        NOT NULL,
  enabled           BOOLEAN     NOT NULL DEFAULT TRUE,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_id, notification_type)
);

-- Index for mobile client lookups (by profile)
CREATE INDEX notification_preferences_lookup_idx
  ON notification_preferences (profile_id, notification_type);

-- Partial index for backend filtering (opted-out rows only, small set)
CREATE INDEX notification_preferences_opted_out_idx
  ON notification_preferences (notification_type)
  WHERE enabled = FALSE;

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own notification preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);
