# AppleApe Studios — Marketing site

Next.js 15 (App Router) + Supabase (Postgres / Auth / RLS) + Tailwind + shadcn/ui.

The studio site for AppleApe — Android games, Web3 apps, and consumer apps. Design tokens are sourced from the Cohere design system documented in `test design .md.md` (see *Assumptions* below for what was adapted).

## Stack

| Layer        | Choice                                                  |
| ------------ | ------------------------------------------------------- |
| Framework    | Next.js 15 (App Router, RSC, Server Actions, React 19)  |
| UI           | Tailwind CSS + shadcn primitives + lucide-react         |
| Motion       | Framer Motion (hero only, gated on `prefers-reduced-motion`) |
| Backend      | Supabase (Postgres, Auth, Storage) with RLS on every table |
| Auth SSR     | `@supabase/ssr` (NOT the deprecated `auth-helpers`)      |
| Email        | Resend (newsletter confirm)                              |
| MDX          | `next-mdx-remote/rsc` — posts are stored in `posts.content_mdx` |
| Analytics    | Vercel Analytics + optional Plausible                    |
| Hosting      | Vercel (Edge for static pages, Node for service-role writes) |

## Local development

```powershell
# 1. Install deps
npm install

# 2. Copy env example (fill it in after step 4 prints local credentials)
Copy-Item .env.local.example .env.local

# 3. Initialize the Supabase folder (one-time — creates supabase/config.toml)
npx supabase init

# 4. Start the local Supabase stack (Postgres, Auth, Studio). Needs Docker.
#    On first run this prints the local Supabase URL, anon key, and service-role
#    key — paste these into .env.local.
npx supabase start

# 5. Apply migrations + run seed.sql against the local DB.
#    NOTE: use `db reset` for local; `db push` is for linked REMOTE projects only.
npx supabase db reset

# 6. Regenerate types from the local DB (overwrites the hand-stub)
npm run db:types

# 7. Run the app
npm run dev
# → http://localhost:3000
```

The home page degrades gracefully when `NEXT_PUBLIC_SUPABASE_URL` is missing — it renders fallback content rather than 500ing. Every query helper in [lib/supabase/queries.ts](lib/supabase/queries.ts) wraps Supabase calls in a `safeSelect` that returns `[]` on error.

### Pushing to a remote (hosted) Supabase project

`supabase db push` only works once the CLI is linked to a remote project:

```powershell
npx supabase login
npx supabase link --project-ref <your-project-ref>   # from your Supabase dashboard URL
npx supabase db push                                  # applies pending migrations to remote

# `db push` does NOT run seed.sql. Seed remote by pasting supabase/seed.sql
# into the SQL editor, or:
Get-Content supabase/seed.sql | npx supabase db query --linked

# Regenerate types from the linked project
npx supabase gen types typescript --linked > types/database.types.ts
```

## Environment

| Variable                          | Required | Used by                                                                    |
| --------------------------------- | -------- | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | yes      | All clients                                                                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | yes      | Browser + RSC clients                                                      |
| `SUPABASE_SERVICE_ROLE_KEY`       | yes (writes) | Server actions, rate-limit RPC. **Never expose to the browser.**       |
| `NEXT_PUBLIC_SITE_URL`            | yes      | Canonical URLs, OG, sitemap, confirm-email links                           |
| `RESEND_API_KEY`                  | optional | Newsletter confirm email. Without it the app logs the token in dev.        |
| `RESEND_FROM_EMAIL`               | optional | From-address for transactional email                                       |
| `IP_HASH_SALT`                    | recommended | Salt for SHA-256 hashing of client IPs in rate-limit + audit columns    |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`    | optional | Loads the Plausible script when set                                        |

## Supabase

- Schema lives in [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql). One migration, every table, RLS, helper functions, and indexes.
- Seed data in [supabase/seed.sql](supabase/seed.sql) — enough to render the home page on a fresh DB without empty states.
- RLS is enabled on **every** table. Anonymous users can `SELECT` only rows where `published = true` (or `active = true` for team/jobs). Anonymous `INSERT` is allowed only on the three submission tables (`newsletter_subscribers`, `contact_submissions`, `job_applications`). All `UPDATE`/`DELETE` is gated by `is_admin()`.
- Rate limiting is enforced in server actions via the Postgres `check_rate_limit(ip_hash, action, max_count, window_seconds)` SECURITY DEFINER function, called from the service-role client. Buckets live in `rate_limit_buckets` and auto-prune after 24h.
- The `is_admin()` helper reads `auth.jwt() -> 'app_metadata' ->> 'role'`. Set this via the service role when promoting CMS admins.

### Working with branches / preview databases

Recommended setup:

1. Create a Supabase project per environment (`local`, `preview`, `prod`).
2. In Vercel, add `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` per environment (Production / Preview / Development).
3. Apply migrations to preview before promoting: `npx supabase db push --linked` after `npx supabase link --project-ref <preview>`.
4. After each migration, regenerate types: `npm run db:types`.

## Forms

All form submissions use **Server Actions** ([app/actions/newsletter.ts](app/actions/newsletter.ts), [app/actions/contact.ts](app/actions/contact.ts)). The shape is:

1. Parse `FormData` with a zod schema ([lib/validators/](lib/validators)).
2. Hash the client IP ([lib/ip.ts](lib/ip.ts)) and check rate limit via the Postgres function.
3. Insert via the service-role client, returning a discriminated-union `state` for the form.

The newsletter uses double opt-in: insert with `confirmed = false` and a UUID `confirm_token`, send the user a Resend link to `/api/newsletter/confirm?token=<token>` which flips the flag. JSON API wrappers exist at [app/api/newsletter/route.ts](app/api/newsletter/route.ts) and [app/api/contact/route.ts](app/api/contact/route.ts) for non-form clients.

## Performance budgets

- LCP < 2.0s on 4G mobile (home route).
- CLS < 0.05.
- JS < 170KB gz on `/`. Hero motion uses Framer Motion only on the hero subtree; everything else is server-rendered.

Tactics:

- `next/font` for self-hosted Google fonts (Space Grotesk, Inter, IBM Plex Mono) with `display: swap`.
- `next/image` everywhere; `priority` only on hero artwork and game-detail hero.
- `revalidate = 300` on data-driven pages so Supabase isn't hit on every request.
- Middleware matcher excludes static assets and image routes (see [middleware.ts](middleware.ts)).

## Accessibility

- WCAG 2.1 AA target. Semantic landmarks (`<header>`, `<main>`, `<footer>`, labelled `<section>`s, `<article>`s with headings).
- Touch targets ≥ 48×48px on mobile; visible focus rings using `--focus-blue`; skip link in [app/layout.tsx](app/layout.tsx).
- Mobile drawer is focus-trapped via Radix Dialog ([components/ui/sheet.tsx](components/ui/sheet.tsx)).
- All motion is gated on `prefers-reduced-motion` (CSS layer reset in [app/globals.css](app/globals.css) + `useReducedMotion` in the hero).

## Deployment (Vercel)

1. Push the repo to GitHub.
2. Import in Vercel; framework auto-detects as Next.js.
3. Add env vars under **Project Settings → Environment Variables**. Set the same keys for Production and Preview (different values per Supabase project).
4. **No custom build command needed.** Vercel's default `next build` is correct.
5. First deploy. Visit `/sitemap.xml` and `/robots.txt` to verify SEO surfaces resolve with seeded slugs.

### Custom domain checklist

- Set `NEXT_PUBLIC_SITE_URL` to the production domain so canonical URLs, OG tags, and confirm-email links match.
- Configure the Resend sender domain (DKIM/SPF) for production. Until verified, transactional email won't deliver.

## Assumptions sourced from `test design .md.md`

The attached design doc describes Cohere's enterprise-AI system. Applied verbatim per the doc's own principle that *"photography and product mockups carry color, while the UI shell stays restrained"* — gaming energy lives in artwork, not chrome. Specific adaptations:

1. **Fonts.** Proprietary CohereText / Unica77 / CohereMono are unavailable; we use the doc's documented fallbacks: Space Grotesk (display), Inter (body), IBM Plex Mono (mono labels).
2. **Dark mode.** Dark mode promotes the doc's deep-green / near-black product-band colors to the page surface.
3. **Web3 chain chips** use monochrome marks per the doc's trust-logo guidance — not saturated chain brand colors.
4. **Radii.** 22px on major media, 8px on cards, 32px pill on CTAs — exactly per the doc's `Radius Scale`.
5. **Motion.** Framer Motion used only on the hero subtree.

## Folder tree (purpose summary)

| Path                              | Purpose                                                                  |
| --------------------------------- | ------------------------------------------------------------------------ |
| `app/(marketing)/`                | Marketing route group — every public-facing page                         |
| `app/actions/`                    | Server actions called from forms                                         |
| `app/api/`                        | JSON HTTP wrappers around server actions + the newsletter confirm route  |
| `app/layout.tsx`                  | Fonts, theme provider, header, footer, metadata defaults                 |
| `app/sitemap.ts`, `app/robots.ts` | SEO endpoints, pulling slugs from Supabase                               |
| `components/ui/`                  | shadcn primitives (button, input, sheet, textarea, announcement-bar)     |
| `components/layout/`              | Site shell (header, footer, mobile nav, theme toggle)                    |
| `components/sections/`            | Home page sections                                                       |
| `components/cards/`               | Game / Web3 / Post cards                                                 |
| `components/forms/`               | Newsletter + Contact client forms                                         |
| `lib/supabase/`                   | Browser, server, middleware, service-role clients + query helpers        |
| `lib/validators/`                 | zod schemas (one per form)                                               |
| `lib/content/`                    | MDX renderer + reading-time                                              |
| `lib/seo.ts`                      | JSON-LD builders (Organization, VideoGame, Article)                      |
| `lib/rate-limit.ts`, `lib/ip.ts`  | Postgres-backed sliding-window rate limiter and IP hasher                |
| `supabase/migrations/`            | One init migration; one file per change going forward                    |
| `supabase/seed.sql`               | Demo data so the home page renders on a fresh DB                         |
| `types/database.types.ts`         | Generated DB types (overwritten by `npm run db:types`)                   |

## Scripts

| Command                | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Start the dev server on :3000                 |
| `npm run build`        | Production build + typecheck                  |
| `npm run start`        | Serve the production build                    |
| `npm run lint`         | Lint via `next lint`                          |
| `npm run typecheck`    | `tsc --noEmit`                                |
| `npm run db:push`      | Apply migrations against the linked DB        |
| `npm run db:reset`     | Reset the local DB and reapply migrations + seed |
| `npm run db:types`     | Regenerate `types/database.types.ts` from the local DB |

## Manual verification checklist

- [ ] `npm install` succeeds without peer-dep warnings.
- [ ] `npx supabase db push` applies cleanly against a fresh project.
- [ ] `npm run db:types` produces non-empty types.
- [ ] `npm run dev` boots; `/` renders header + hero + cards + footer.
- [ ] `npm run build` passes typecheck.
- [ ] Home page renders with seeded data.
- [ ] Breaking `NEXT_PUBLIC_SUPABASE_URL` still renders the home page without 500.
- [ ] `/games/apex-runners` renders the detail template; `/games/nope` returns 404.
- [ ] `/sitemap.xml` and `/robots.txt` resolve with seeded slugs.
- [ ] Newsletter form submission writes a row to `newsletter_subscribers`; Resend logs (or console) show the confirm token; clicking the confirm link redirects to `/newsletter?status=confirmed`.
- [ ] Contact form submission writes a row to `contact_submissions`. Rapid resubmits return the rate-limit message.
- [ ] Empty-email zod failure shows inline error without a Supabase round-trip.
