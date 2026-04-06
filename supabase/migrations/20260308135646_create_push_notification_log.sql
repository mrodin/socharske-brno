CREATE TABLE push_notification_log (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id       UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notification_type TEXT       NOT NULL,
  sent_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX push_notification_log_lookup_idx
  ON push_notification_log (profile_id, notification_type, sent_at);

-- Only service role can access this table
ALTER TABLE push_notification_log ENABLE ROW LEVEL SECURITY;
