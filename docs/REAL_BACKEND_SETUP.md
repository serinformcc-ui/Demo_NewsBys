# Newsbys Real Backend Setup

This turns the demo flow into a real scheduled publishing pipeline.

## 1. Supabase

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Copy:
   - Project URL -> `SUPABASE_URL`
   - Service role key -> `SUPABASE_SERVICE_ROLE_KEY`

The service role key must only live in Vercel environment variables, never in browser code.

## 2. Vercel Blob

1. In Vercel, open the project.
2. Storage -> Create Database -> Blob.
3. Use public storage for Instagram images, because Meta needs a public `image_url`.
4. Copy the token into `BLOB_READ_WRITE_TOKEN`.

## 3. Meta / Instagram

For real Instagram publishing, each Instagram account must be professional/business and connected to a Facebook Page.

For each Instagram account, store in `social_accounts`:

- `network = 'Instagram'`
- `external_account_id = Instagram Business Account ID`
- `access_token = valid Meta token with publishing permissions`

The cron endpoint uses:

1. `POST /{ig-user-id}/media` with `image_url` and `caption`
2. `POST /{ig-user-id}/media_publish` with the returned `creation_id`

Official docs:

- https://developers.facebook.com/docs/instagram-platform/content-publishing/
- https://developers.facebook.com/docs/instagram-platform/reference/instagram-user/media/
- https://developers.facebook.com/docs/instagram-platform/reference/instagram-user/media_publish/

## 4. Vercel Environment Variables

Set:

```text
VITE_REAL_BACKEND_ENABLED=true
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
BLOB_READ_WRITE_TOKEN=...
CRON_SECRET=choose-a-long-random-value
META_GRAPH_VERSION=v23.0
```

## 5. Scheduler / Cron

Vercel Hobby only allows Cron Jobs once per day, so this repo does **not** register a Vercel Cron Job by default.

The publishing endpoint still exists:

```text
/api/cron/publish-due
```

Use one of these options:

1. External scheduler such as cron-job.org, EasyCron, Better Stack, GitHub Actions schedule, or any server you control.
2. Supabase Edge Function scheduled by Supabase.
3. Upgrade Vercel to Pro and add this back to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/publish-due",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

For Hobby, configure the external scheduler to call every 5 minutes:

```text
https://YOUR-VERCEL-DOMAIN.vercel.app/api/cron/publish-due?secret=YOUR_CRON_SECRET
```

or send:

```text
Authorization: Bearer YOUR_CRON_SECRET
```

The cron publishes due rows from `scheduled_posts` where:

```sql
status = 'scheduled'
scheduled_at <= now()
```

## 6. Local test

With env vars configured:

1. Upload an image via `/api/upload-image`.
2. Create a scheduled post via `/api/schedule-post`.
3. Call `/api/cron/publish-due?secret=YOUR_CRON_SECRET`.

In production on Vercel Hobby, your external scheduler calls the cron endpoint.
