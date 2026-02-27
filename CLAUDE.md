# HomelessGuyNABOX Newsletter

## Project Overview
Newsletter and bulletin system for [homelessguynabox.org](https://homelessguynabox.org) — a 24/7 music streaming site with 800+ songs. Deployed on Hostinger VPS via Easypanel/Docker at `newsletter.homelessguynabox.org`.

## Live URL
- **Site:** https://newsletter.homelessguynabox.org
- **Admin:** https://newsletter.homelessguynabox.org/admin/login
- **GitHub:** https://github.com/ExperienceTech12/homelessguynabox-newsletter (public)

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript, Turbopack)
- **Database:** SQLite via Prisma 7 + better-sqlite3 adapter
- **Auth:** NextAuth v4 (credentials provider, JWT)
- **UI:** Tailwind CSS v4 + shadcn/ui + Lucide icons
- **Email:** Resend (infrastructure ready, not yet active)
- **Markdown:** react-markdown + remark-gfm for newsletter content
- **Deployment:** Docker on Easypanel (Hostinger VPS), Traefik reverse proxy + auto-SSL

## Hosting & Infrastructure
- **VPS:** Hostinger VPS (same as QF Project Discord bot) — IP `76.13.24.99`
- **Easypanel:** Manages deployment at `http://76.13.24.99:3000`
- **DNS:** A record `newsletter` → `76.13.24.99` in Hostinger DNS
- **Main site:** homelessguynabox.org is on separate Hostinger Horizons hosting (NOT this VPS)
- **Container port:** 80 (important: Easypanel domain must map to port 80, not 3000)
- **Database auto-seeds on first container start** via `seed-db.js` + `docker-entrypoint.sh`

## Key Directories
```
src/
├── app/                   # Pages and API routes
│   ├── page.tsx           # Public homepage (newsletter listing)
│   ├── post/[slug]/       # Individual newsletter view
│   ├── subscribe/         # Subscribe page
│   ├── unsubscribe/       # Unsubscribe page
│   ├── admin/             # Admin dashboard, login, management
│   └── api/               # REST API routes
├── components/            # React components
│   ├── ui/                # shadcn/ui base components
│   ├── navbar.tsx         # Site navigation
│   ├── footer.tsx         # Site footer
│   ├── newsletter-card.tsx    # Newsletter listing card
│   ├── newsletter-editor.tsx  # Admin markdown editor with preview
│   ├── subscribe-form.tsx     # Subscribe form (compact + full)
│   └── providers.tsx      # NextAuth SessionProvider
├── lib/                   # Utilities
│   ├── prisma.ts          # Prisma client singleton (better-sqlite3 adapter)
│   ├── auth.ts            # NextAuth configuration
│   ├── email.ts           # Resend email infrastructure
│   └── slugify.ts         # URL slug generator
├── types/                 # TypeScript declarations
└── generated/prisma/      # Generated Prisma client

# Root files
├── Dockerfile             # Multi-stage Docker build
├── docker-entrypoint.sh   # Startup script (runs seed-db.js then server)
├── seed-db.js             # Auto-seeds DB on first run (admin + sample posts)
└── prisma.config.ts       # Prisma 7 config (migrations only)
```

## Database Models
- **Admin** — admin users (username/password auth)
- **Newsletter** — posts with title, slug, markdown content, category, tags, featured/pinned flags
- **Subscriber** — email subscribers with confirm/unsub tokens
- **EmailLog** — email delivery tracking (for future use)
- **SiteSettings** — singleton config (site name, tagline, stream URL)

## Newsletter Categories
- `update` — general updates
- `announcement` — major announcements
- `promotion` — stream promotions
- `bulletin` — community bulletins

## Admin Credentials (Default)
- **Username:** admin
- **Password:** admin123
- **CHANGE THE PASSWORD!** Log in at /admin/login

## Local Development
```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run db:push      # Run Prisma migrations
npm run db:seed      # Seed database (admin + sample posts)
npm run db:studio    # Open Prisma Studio
```

## Deploying Changes
1. Make changes locally
2. `npm run build` to verify
3. `git push` to GitHub
4. Hit **Deploy** in Easypanel → it pulls from GitHub and rebuilds automatically

## Environment Variables (set in Easypanel)
```
DATABASE_URL=file:./prisma/dev.db
NEXTAUTH_SECRET=hgnabox-newsletter-secret-k3y-2026-xR9m
NEXTAUTH_URL=https://newsletter.homelessguynabox.org
NEXT_PUBLIC_SITE_URL=https://newsletter.homelessguynabox.org
```

## Enabling Email (Future)
1. Sign up for [Resend](https://resend.com)
2. Add domain verification for homelessguynabox.org
3. Add `RESEND_API_KEY` and `EMAIL_FROM` env vars in Easypanel
4. Uncomment Resend integration in `src/lib/email.ts`
5. Redeploy

## Design Theme
- Dark-first design (music streaming aesthetic)
- Purple (#a855f7) primary accent
- Cyan (#06b6d4) secondary accent
- Gradient text effects, glow borders
- Custom prose styling for newsletter content
- Mobile responsive with hamburger nav

## Future Ideas
- Email-based newsletters (Resend integration)
- Analytics dashboard (open/click tracking)
- Scheduled publishing
- RSS feed
- Integration with main Horizons site (Newsletter button linking here)

## Rules
- Always test with `npm run build` before pushing
- Keep newsletter content in Markdown format
- Push to GitHub + Deploy in Easypanel to update production
- Don't touch the main site (homelessguynabox.org) — it's on separate hosting
