# Delhi Shoe Palace — Production Deployment Guide

This document contains instructions for managing and maintaining the production deployment of the Delhi Shoe Palace website.

## Infrastructure
- **Hosting Platform**: Vercel (Project: `delhi-shoe-palace`)
- **Database**: Supabase PostgreSQL (Region: Singapore `ap-southeast-1` for closest proximity to India)
- **Media Storage**: Cloudinary (Cloud Name: `[your-cloud-name]`)
- **Email Service**: Resend
- **Domain Name**: `delhishoepalace.com` (Registrar: `[your-registrar]`)
- **Analytics**: Google Analytics 4 (GA4) + Vercel Analytics + Vercel Speed Insights
- **Cache / Rate Limiting**: Upstash Redis
- **Error Monitoring**: Sentry

---

## Database Backups
Supabase automatically backs up your database daily on the free tier (7-day retention).
To restore a backup:
1. Go to the [Supabase Dashboard](https://supabase.com).
2. Select your project `delhi-shoe-palace-prod`.
3. Go to **Database** > **Backups**.
4. Select the desired point-in-time snapshot and click **Restore**.

### Manual Backup (CLI)
To check that your local schema matches the database before running migration scripts:
```bash
npx prisma db pull
```
You can also generate database dumps directly through the Supabase Dashboard SQL editor or PG tools.

---

## Rolling Back a Bad Deployment
Vercel keeps a history of all deployments, making rollbacks instant and safe without needing a rebuild:
1. Go to the [Vercel Dashboard](https://vercel.com).
2. Select the `delhi-shoe-palace` project.
3. Click on the **Deployments** tab.
4. Find the last known-good deployment.
5. Click the three dots `...` on that deployment and select **Promote to Production**.
6. The changes will go live immediately.

---

## Rotating Secrets
If any API key or secret is compromised, follow these steps to rotate it:
1. Generate a new API key/credential at the service provider (Google, Cloudinary, Resend, Sentry, Upstash, etc.).
2. Go to **Vercel Dashboard** > **Project Settings** > **Environment Variables**.
3. Edit the compromised variable and paste the new key.
4. Revoke the old key at the service provider.
5. Trigger a redeploy of the latest build for the changes to take effect:
   - Go to **Deployments** > click `...` on the latest deployment > select **Redeploy**.

---

## Adding Real Product Photos
For details on how the admin adds photos, see [STORE_OWNER_GUIDE.md](file:///Users/namanpanwar/Documents/footwear-website/STORE_OWNER_GUIDE.md) or the **Adding Real Product Photos** section in the [README.md](file:///Users/namanpanwar/Documents/footwear-website/README.md).

---

## Emergency Contacts
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **Sentry Support**: [sentry.io/support](https://sentry.io/support)
- **Domain Registrar**: [your registrar's support URL]

---

## Environment Variables Reference
Ensure all these environment variables are set in the Vercel project before deploying:

### Database
- `DATABASE_URL`: Supabase connection pooled connection string (with transaction mode enabled).
- `DIRECT_URL`: Supabase direct connection string (used for running database migrations).

### Authentication
- `NEXTAUTH_URL`: `https://delhishoepalace.com` (Set to the custom domain when configured, or the temporary `.vercel.app` URL beforehand).
- `NEXTAUTH_SECRET`: Secret key generated using `openssl rand -base64 32`.
- `GOOGLE_CLIENT_ID`: OAuth 2.0 client ID from Google Cloud Console.
- `GOOGLE_CLIENT_SECRET`: OAuth 2.0 client secret from Google Cloud Console.

### Cloudinary (Media Storage)
- `CLOUDINARY_CLOUD_NAME`: Cloud name from Cloudinary Dashboard.
- `CLOUDINARY_API_KEY`: API Key from Cloudinary Dashboard.
- `CLOUDINARY_API_SECRET`: API Secret from Cloudinary Dashboard.

### Email (Resend)
- `RESEND_API_KEY`: API key from Resend Dashboard.

### Analytics & Tracking
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Google Analytics 4 measurement ID (`G-XXXXXXXXXX`).

### Store Information (Displayed on site)
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: Format: `919876543210` (Country code + phone number, no spaces or `+`).
- `NEXT_PUBLIC_STORE_ADDRESS`: Full physical address of the store.
- `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL`: Embeddable Google Maps iframe URL.
- `NEXT_PUBLIC_GOOGLE_MAPS_URL`: Direct link to Google Maps location.
- `NEXT_PUBLIC_INSTAGRAM_URL`: Link to Instagram page.
- `NEXT_PUBLIC_FACEBOOK_URL`: Link to Facebook page.
- `NEXT_PUBLIC_GOOGLE_REVIEWS_URL`: Link to review store on Google Maps.

### Site Verification
- `NEXT_PUBLIC_SITE_DOMAIN`: `delhishoepalace.com`
- `NEXT_PUBLIC_SITE_URL`: `https://delhishoepalace.com`
- `GOOGLE_SITE_VERIFICATION`: Verification code from Google Search Console.

### Security & Rates
- `RECAPTCHA_SITE_KEY`: Google reCAPTCHA v3 site key.
- `RECAPTCHA_SECRET_KEY`: Google reCAPTCHA v3 secret key.
- `UPSTASH_REDIS_REST_URL`: Upstash Redis connection REST URL.
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis REST token.

### Error Tracking
- `NEXT_PUBLIC_SENTRY_DSN`: DSN link from Sentry project settings.
- `SENTRY_ORG`: Organization slug in Sentry.
- `SENTRY_PROJECT`: Project slug in Sentry.
- `SENTRY_AUTH_TOKEN`: Auth token generated in Sentry for uploading source maps during build.
