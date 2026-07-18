# Delhi Shoe Palace — Digital Catalog

## Overview

Premium digital footwear catalog for **Delhi Shoe Palace** — a trusted retail store in Karol Bagh, New Delhi with over 24 years in business. Browse products, save wishlists, take style quizzes, compare products, and inquire via WhatsApp. **No online sales** — all purchases happen in-store.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, CSS Variables |
| Components | Shadcn UI, Radix Primitives |
| Database | PostgreSQL / SQLite (dev) |
| ORM | Prisma |
| Auth | Auth.js v5 (credentials + Google OAuth) |
| Images | Cloudinary, Next-Cloudinary |
| Email | Resend |
| 3D | Three.js, React Three Fiber, Drei |
| Animation | GSAP, Framer Motion, Lenis |
| Monitoring | Sentry |
| Analytics | Google Analytics 4 |
| State | Zustand, SWR |
| Forms | React Hook Form + Zod |

## Getting Started

```bash
# 1. Clone the repository
git clone <repo-url>
cd dsp-website

# 2. Copy environment variables
cp .env.example .env.local

# 3. Fill all env variables (see ENV SETUP section below)

# 4. Install dependencies
npm install

# 5. Push database schema (development)
npx prisma db push

# 6. Seed the database
npx prisma db seed

# 7. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## ENV SETUP

| Variable | Where to Get |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (or SQLite `file:./dev.db` for dev) |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID/SECRET` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `CLOUDINARY_*` | [Cloudinary Dashboard](https://cloudinary.com/console) |
| `RESEND_API_KEY` | [Resend Dashboard](https://resend.com/api-keys) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | [Google Analytics](https://analytics.google.com) |
| `RECAPTCHA_SITE_KEY/SECRET_KEY` | [reCAPTCHA Admin](https://www.google.com/recaptcha/admin) |
| `NEXT_PUBLIC_SENTRY_DSN` | [Sentry Dashboard](https://sentry.io) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Format: `919876543210` (country code + number, no `+`) |

## Adding Real Product Photos

Currently using **placeholder images** from Unsplash. To replace with real store photos:

1. Go to `/admin` (login as admin)
2. Navigate to **Products**
3. Click **Edit** on any product
4. Scroll to **Image Manager**
5. Upload photos from your catalog
6. Set first photo as **PRIMARY**, others as **GALLERY** or **LIFESTYLE**
7. Recommended size: **800×800px minimum**, JPG or WebP

> All placeholder images have `alt` text containing "Placeholder" — search for these in the admin to find products needing real photos.

## Admin Access

- **URL:** `/admin`
- **Default Email:** `admin@delhishoepalace.com`
- **Default Password:** `Admin@123`

> ⚠️ **IMPORTANT:** Change the admin password immediately after first login.

## Deployment (Vercel)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Set all environment variables from `.env.example`
4. Set `DATABASE_URL` to your production PostgreSQL URL
5. Add build command: `npx prisma generate && next build`
6. Deploy!

### Post-deployment:
- Run `npx prisma migrate deploy` against your production database
- Seed production data: `npx prisma db seed`
- Verify all features work via the admin dashboard

## Phase Completion Status

- [x] **Phase 1:** Foundation — Next.js, Prisma, Auth.js, Tailwind, Shadcn
- [x] **Phase 2:** Public UI — Product listing, product detail, categories, contact
- [x] **Phase 3:** Protected Features — Wishlist, compare, recently viewed, quiz
- [x] **Phase 4:** Admin Dashboard — Products CRUD, users, analytics, settings
- [x] **Phase 5:** Polish + Three.js — Animations, loading screen, SEO, accessibility
- [x] **Phase 6:** Integrations — Dark/light mode, email templates, newsletter, Sentry, GDPR, social

## License

Private — Delhi Shoe Palace. All rights reserved.
