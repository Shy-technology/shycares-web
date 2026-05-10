# Shycares 🐾

A booking SaaS for solo pet care providers (groomers, boarders, vets) in India.
Each provider gets a beautiful microsite at `shycares.in/[their-name]`, a calendar
dashboard, customer + pet records, and one-tap WhatsApp reminders.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · Supabase (Postgres + Auth + Storage) · Vercel

---

## 🚀 Ship-it checklist (do this in order)

You should be live on `www.shycares.in` in about an hour.

### 1. Local setup (5 min)

```bash
# from this folder
npm install
cp .env.local.example .env.local
# fill in the Supabase values (next step)
npm run dev
# open http://localhost:3000
```

### 2. Supabase setup (15 min)

1. Open your Supabase project (you mentioned one is already created).
2. Go to **Project Settings → API** and copy:
   - `Project URL` → paste into `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)
3. Go to **SQL Editor → New query**, paste the entire contents of
   `supabase/migrations/0001_init.sql`, and click **Run**.
   This creates all tables, RLS policies, storage buckets, and the trigger
   that auto-creates a profile when someone signs up.
4. Go to **Authentication → Providers → Google** and:
   - Toggle Google **on**.
   - Open [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
     create an OAuth 2.0 Client ID (type: Web app).
   - Authorized redirect URI: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
   - Copy the Client ID + Client Secret back into Supabase Google provider settings → **Save**.
5. Still in **Authentication → URL Configuration**, add to "Redirect URLs":
   - `http://localhost:3000/auth/callback`
   - `https://www.shycares.in/auth/callback`
   - `https://shycares.in/auth/callback`

### 3. Vercel deploy (10 min)

1. Push this folder to a fresh GitHub repo (`shycares/web`).
2. In Vercel → **Add New Project → Import** that repo.
3. **Environment Variables** — paste in the same three Supabase values from `.env.local`,
   plus `NEXT_PUBLIC_SITE_URL=https://www.shycares.in`.
4. Click **Deploy**.
5. After it builds, go to **Project → Settings → Domains** → add `shycares.in` and `www.shycares.in`.
6. Vercel will tell you the DNS records to add. In your domain registrar (BigRock/GoDaddy etc.):
   - `A` record for `@` → `76.76.21.21`
   - `CNAME` record for `www` → `cname.vercel-dns.com`
7. SSL provisions automatically in a few minutes.

### 4. Smoke test (5 min)

1. Open `https://www.shycares.in` — landing page should render.
2. Click "Get started" → sign in with your own Google account.
3. Fill the onboarding wizard with a test business (e.g., slug `demo`).
4. Open `https://www.shycares.in/demo` in an incognito tab — your microsite
   should render.
5. Submit a test booking. You should see it in your dashboard at `/dashboard`.

If everything works, you're ready to onboard your first real groomer. 🎉

---

## 🤝 Onboarding your first paying customer (this weekend)

You said you already have a groomer in mind. Here's the playbook:

**Day 1 — Pre-call prep (30 min)**
1. Sign in as them via your dashboard (or have them do it on a call together).
2. Pre-fill their onboarding using info you already know about their business —
   services, prices, hours. Get them to a live microsite in <5 minutes.
3. Take 3–5 photos of their work (phone is fine) and add them via Settings.

**Day 1 — The pitch (15 min call)**
- Show them their live microsite at `shycares.in/their-name`.
- Walk through booking flow on a phone (use the QR code from `shycares.in/their-name`).
- Show how a booking lands in their dashboard with a one-tap WhatsApp reply.
- Pitch: "Free this month, ₹499/mo after. Cancel anytime. I'll personally help
  you set it up and make sure your customers love it."

**Day 1 — Get them to the link**
- Replace the link in their **Instagram bio** with `shycares.in/their-name`.
- Send the link in the WhatsApp Status or to their last 10 customers:
  > "Hey! I'm trying out a new way to take bookings 🐾 — just reply on WhatsApp
  >  and I'll confirm. Tap here: shycares.in/their-name"

**Day 2–5 — Watch & iterate**
- Check in daily. Watch your dashboard for failed booking attempts (incomplete forms = friction).
- Ask them WhatsApp questions: *"What was confusing? What didn't work?"*
- Fix one thing per day. Push a Vercel deploy.

**Day 6 (or when first paid booking lands) — Ask for the money**
- Send a Razorpay payment link manually for the first month (₹499). Don't
  build payments into the product yet — just collect manually.
- Once they've paid: write a short customer testimonial in their words.
- Post the testimonial + microsite screenshot on your own LinkedIn/Twitter.
  This is your **second customer's** acquisition channel.

---

## 🗂 Project structure

```
app/
├── page.tsx              # Marketing landing page
├── login/                # Google OAuth login
├── auth/callback/        # OAuth callback handler
├── logout/               # Sign out
├── onboarding/           # First-time setup wizard
├── dashboard/            # Groomer's private workspace
│   ├── page.tsx          # Calendar (default)
│   ├── customers/        # Customer + pet records
│   └── settings/         # Edit business + services
├── [slug]/               # Public microsite (shycares.in/[slug])
│   ├── page.tsx          # Service catalog + hours
│   └── book/             # Booking flow + confirmation
└── not-found.tsx
lib/
├── supabase/             # Supabase client (browser, server, middleware)
├── types.ts              # Domain types
└── utils.ts              # cn(), formatPrice(), whatsappLink(), slugify()
supabase/
└── migrations/0001_init.sql  # Run this once
middleware.ts             # Auth gate for /dashboard, /onboarding
```

---

## 🛣 What's NOT built yet (and when to add it)

These were intentionally deferred to keep the MVP shippable. Add them once
you have at least 1 paying customer asking for them.

| Feature | When to build | Effort |
|---|---|---|
| Photo uploads (logo, gallery) via Supabase Storage | After first customer | 1 day |
| Razorpay UPI payments | After first customer asks | 2 days |
| Automated WhatsApp reminders (AiSensy/Interakt) | After 10 customers | 2 days |
| Custom domain per business (`happypaws.com`) | Pro tier feature, later | 1 day |
| Multi-staff calendars | Way later | 3 days |
| Reviews/ratings | After 30 customers | 1 day |
| Email notifications (Resend) | Anytime | 0.5 day |

---

## 🐛 Common gotchas

- **OAuth redirect mismatch**: triple-check the callback URLs in Supabase Auth
  settings match your actual deployed domain (with and without `www`).
- **RLS denying everything**: confirm you ran the entire migration SQL — RLS
  policies are at the bottom.
- **Slug conflicts with routes**: `RESERVED_SLUGS` in `lib/utils.ts` blocks
  slugs like `dashboard`, `login`, `api` etc. Add to it if you create new
  top-level routes.
- **Booking submit fails**: check Supabase logs. Most likely the RLS policy
  for inserting a customer/booking is failing — make sure the business is
  `is_published = true`.

---

Built with ☕ and 🐶 in May 2026.
