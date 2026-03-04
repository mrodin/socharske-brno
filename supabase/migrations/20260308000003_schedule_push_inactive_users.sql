-- Prerequisites: run these two statements manually in the Supabase SQL editor
-- BEFORE applying this migration (replace the placeholder values):
--
--   ALTER DATABASE postgres SET app.supabase_url = 'https://YOUR_PROJECT_REF.supabase.co';
--   ALTER DATABASE postgres SET app.cron_secret  = 'YOUR_CRON_SECRET_VALUE';
--
-- The same CRON_SECRET value must also be set as an Edge Function secret:
--   supabase secrets set CRON_SECRET=YOUR_CRON_SECRET_VALUE
--
-- Schedule: daily at 15:00 UTC = 16:00 CET (winter) / 17:00 CEST (summer, 1h drift accepted)

SELECT cron.schedule(
  'push-inactive-users-daily',
  '0 15 * * *',
  $$
    SELECT net.http_post(
      url     := current_setting('app.supabase_url') || '/functions/v1/push-inactive-users',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || current_setting('app.cron_secret')
      ),
      body    := '{}'::jsonb
    ) AS request_id;
  $$
);
