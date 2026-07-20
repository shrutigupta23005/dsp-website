# Phase 7 QA Report — Delhi Shoe Palace

**Date**: July 2026  
**Scope**: Testing, QA, Edge Case Fixes  
**Stack**: Next.js 14, TypeScript, Tailwind, Shadcn, Prisma (SQLite), Auth.js v5

---

## Summary

Phase 7 hardened the entire application without adding new features. All changes are fixes, safeguards, or verification infrastructure.

---

## Section Status

| # | Section | Status | Files Modified |
|---|---------|--------|----------------|
| 1 | Auth Flow Edge Cases | ✅ Complete | `schema.prisma`, `validators.ts`, `register/route.ts`, `forgot-password/route.ts`, `verify-otp/route.ts` |
| 2 | Middleware & Auth Redirects | ✅ Complete | `middleware.ts` |
| 3 | Admin Protection | ✅ Complete | `scripts/audit-admin-routes.ts` (new), `admin/users/[id]/route.ts` |
| 4 | Login Page UX | ✅ Complete | `auth/login/page.tsx` |
| 5 | Wishlist & Compare | ✅ Complete | `useWishlist.ts`, `compareStore.ts` |
| 6 | Guest Limit Wall | ✅ Complete | `products/page.tsx` |
| 7 | Upload Error Handling | ✅ Complete | `admin/upload/route.ts` |
| 8 | Three.js Performance | ✅ Complete | `HeroScene.tsx` |
| 9 | CSS & Dark Mode | ✅ Complete | `globals.css`, `AdminShell.tsx`, `login/page.tsx` |
| 10 | Sentry PII Scrubbing | ✅ Complete | `sentry-scrub.ts` (new), `sentry.client.config.ts`, `sentry.server.config.ts` |
| 11 | Rate Limiting | ✅ Complete | `rate-limit.ts` |
| 12 | SEO & Config | ✅ Complete | `next.config.ts`, `.env.example` |
| 13 | Testing Infrastructure | ✅ Complete | `playwright.config.ts` (new), `tests/e2e/critical-paths.spec.ts` (new) |
| 14 | QA Report | ✅ Complete | This file |

---

## Detailed Changes

### 1. Auth Flow Edge Cases
- **Prisma Schema**: Added `attempts Int @default(0)` to `VerificationToken` for OTP brute-force protection
- **Validators**: All email fields now `.trim().toLowerCase()`, passwords capped at 72 chars (bcrypt limit), name regex `/^[a-zA-Z\s'-]+$/`, Indian phone regex, HTML tag prevention on product names, unique size validation
- **Register**: Removed redundant findUnique (replaced with P2002 catch for race conditions), added IP rate limiting
- **Forgot Password**: Per-email rate limiting (3 OTP/hour), generic response to prevent email enumeration
- **Verify OTP**: 5-attempt limit with remaining count feedback, expiry checked before match, trimmed OTP

### 2. Middleware & Auth Redirects
- `isSafeRedirect()` function blocks `javascript:`, `data:`, `//` protocol prefixes in callbackUrl
- Admin users redirected to `/admin/dashboard` (not `/`) from auth pages
- Malicious callbackUrl params stripped automatically

### 3. Admin Protection
- Audit script (`scripts/audit-admin-routes.ts`) verified all 23 admin API routes have auth checks ✅
- Role escalation blocked: PATCH `/api/admin/users/[id]` now rejects any `role` field in body

### 4. Login Page UX
- Caps Lock detection with amber warning near password field
- Replaced hardcoded `bg-white` → `bg-background` and `hover:bg-gray-50` → `hover:bg-secondary` for dark mode

### 5. Wishlist & Compare
- Wishlist toggle debounced (300ms) to prevent rapid-click race conditions
- Compare store: `sessionStorage` wrapped in try/catch with in-memory fallback for private browsing

### 6. Guest Limit Wall
- Explicit `skip: 0` enforced server-side for guests — `?page=2` URL manipulation no longer bypasses the 15-product limit

### 7. Upload Error Handling
- Server-side file size validation (5MB limit) before upload
- MIME type validation (jpg/png/webp only)
- Slug sanitization to prevent path traversal in Cloudinary folders
- Specific Cloudinary error handling (quota exceeded → 503 with helpful message)

### 8. Three.js Performance
- Low-end device detection: `hardwareConcurrency ≤ 4` or `deviceMemory ≤ 4GB`
- Low-end: 300 particles (vs 2000), no EffectComposer (Bloom + ChromaticAberration disabled), static shoe, DPR locked to 1, antialiasing off

### 9. CSS & Dark Mode
- `overflow-x: hidden` on html + body prevents horizontal scroll
- Minimum touch target 44px on interactive elements
- `100dvh` utility class for iOS Safari viewport fix
- `*:focus-visible` keyboard accessibility ring
- `-webkit-backdrop-filter` Safari prefix added
- AdminShell forced to `dark` class regardless of site theme

### 10. Sentry PII Scrubbing
- Created `lib/sentry-scrub.ts` that recursively scrubs: password, OTP, token, resetToken, authorization, cookie, creditCard, cvv, ssn
- Applied to both client and server Sentry configs via `beforeSend`
- Dev events suppressed (return null in development)

### 11. Rate Limiting
- Added convenience functions: `rateLimitOtp()` (3/email/hour), `rateLimitAuth()` (10/IP/15min)
- Clear Upstash Redis upgrade block comment with exact migration instructions

### 12. SEO & Config
- `trailingSlash: false` in next.config.ts for consistent canonical URLs
- Upstash Redis placeholders added to `.env.example`

### 13. Testing Infrastructure
- Playwright config: 5 browser targets (Chrome, Firefox, Safari, Pixel 5, iPhone 12)
- E2E test suite: 15 tests covering guest browsing, auth pages, contact form, theme, admin protection, SEO

---

## Manual Verification Checklist

- [ ] Toggle dark/light mode on every page — verify no broken colors
- [ ] Test login with Caps Lock on — verify amber warning appears
- [ ] Visit `/products/nonexistent-slug-12345` — verify 404
- [ ] Guest visits `/products?page=2` — verify still 15 products max
- [ ] Rapid-click wishlist heart 5x — verify no duplicate entries or errors
- [ ] Admin panel stays dark when site is in light mode
- [ ] View page source as guest on blurred cards — verify no product data leak
- [ ] Register with email `  Test@Email.com  ` — verify stored as `test@email.com`
- [ ] Enter wrong OTP 5 times — verify lockout message
- [ ] Try `callbackUrl=javascript:alert(1)` — verify stripped

---

## Run Tests

```bash
# Admin route audit
npx tsx scripts/audit-admin-routes.ts

# E2E tests (requires dev server running)
npx playwright install
npx playwright test

# Type check
npx tsc --noEmit
```
