CREATE TABLE push_notification_prefs (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id        UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notification_type TEXT        NOT NULL,
  enabled           BOOLEAN     NOT NULL DEFAULT TRUE,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_id, notification_type)
);

-- Index for mobile client lookups (by profile)
CREATE INDEX push_notification_prefs_lookup_idx
  ON push_notification_prefs (profile_id, notification_type);

-- Partial index for backend filtering (opted-out rows only, small set)
CREATE INDEX push_notification_prefs_opted_out_idx
  ON push_notification_prefs (notification_type)
  WHERE enabled = FALSE;

ALTER TABLE push_notification_prefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification preferences"
  ON push_notification_prefs FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own notification preferences"
  ON push_notification_prefs FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own notification preferences"
  ON push_notification_prefs FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);
