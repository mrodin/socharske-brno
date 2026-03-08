-- Schedule: daily at 15:00 UTC = 16:00 CET (winter) / 17:00 CEST (summer, 1h drift accepted)
-- Requires vault secrets: project_url, service_role_key

select
  cron.schedule(
    'push-inactive-users-daily',
    '0 15 * * *',
    $
    select
      net.http_post(
        url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/push-inactive-users',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'service_role_key')
        ),
        body := '{}'::jsonb
      ) as request_id;
    $
  );
