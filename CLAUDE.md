# HomelessGuyNABOX Newsletter

## Project Overview
Newsletter and bulletin system for [homelessguynabox.org](https://homelessguynabox.org) — a 24/7 music streaming site with 800+ songs. Hosted on the same Hostinger VPS at `homelessguynabox.org/newsletter` via reverse proxy.

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript, Turbopack)
- **Database:** SQLite via Prisma 7 + better-sqlite3 adapter
- **Auth:** NextAuth v4 (credentials provider, JWT)
- **UI:** Tailwind CSS v4 + shadcn/ui + Lucide icons
- **Email:** Resend (infrastructure ready, not yet active)
- **Markdown:** react-markdown + remark-gfm for newsletter content

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

## Commands
```bash
npm run dev          # Start dev server (localhost:3000/newsletter)
npm run build        # Production build
npm run db:push      # Run Prisma migrations
npm run db:seed      # Seed database (admin + sample posts)
npm run db:studio    # Open Prisma Studio
```

## Admin Credentials (Default)
- **Username:** admin
- **Password:** admin123
- **CHANGE BEFORE DEPLOYING!**

## Deployment (Hostinger VPS)
1. Build with `npm run build` → outputs to `.next/standalone`
2. Copy standalone + `prisma/dev.db` to VPS
3. Set up Nginx reverse proxy: `homelessguynabox.org/newsletter` → `localhost:PORT`
4. Set environment variables (NEXTAUTH_SECRET, NEXTAUTH_URL)
5. Run with `node .next/standalone/server.js`

### Nginx Config Example
```nginx
location /newsletter {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

## Enabling Email (Future)
1. Sign up for [Resend](https://resend.com)
2. Add domain verification for homelessguynabox.org
3. Set `RESEND_API_KEY` and `EMAIL_FROM` in `.env`
4. Uncomment Resend integration in `src/lib/email.ts`

## Design Theme
- Dark-first design (music streaming aesthetic)
- Purple (#a855f7) primary accent
- Cyan (#06b6d4) secondary accent
- Gradient text effects, glow borders
- Custom prose styling for newsletter content
- Mobile responsive with hamburger nav

## Rules
- Always test with `npm run build` before deploying
- Keep newsletter content in Markdown format
- Run `npm run db:seed` on fresh installs
- Change admin password immediately after setup
