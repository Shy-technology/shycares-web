# Shycares Setup Guide — for Non-Technical Founders

Hi Kush. This guide assumes **zero coding background**. You will not open a
terminal, install Node.js, or run any commands on your computer. Everything
happens in your **web browser**.

**Total time: ~75 minutes** (mostly waiting for things to load).

By the end, `https://www.shycares.in` will be live on the internet.

---

## What we're going to do (the big picture)

Imagine your code is like a recipe. We need to:

1. **Put the recipe online** so it's not just on your laptop → upload to **GitHub** (a free code-storage website)
2. **Set up the kitchen** that will run the recipe → set up **Supabase** (your free database)
3. **Tell the kitchen which oven to use** → connect **Google Login**
4. **Hire a chef to run the recipe 24/7** → deploy on **Vercel** (your free web hosting)
5. **Put a sign on the door** → point `shycares.in` at Vercel

Don't worry if any of those words are unfamiliar. I'll explain each one when we get there.

---

## ✅ Before you start — make sure you have these (5 min)

Open these 4 websites in separate tabs and make sure you're logged in. If
you don't have an account, sign up with the same Google account everywhere
to keep things simple.

1. **GitHub** — https://github.com (where the code will live)
2. **Supabase** — https://supabase.com (your database)
3. **Vercel** — https://vercel.com (your website host)
4. **Your domain registrar** — wherever you bought `shycares.in` (BigRock, GoDaddy, Namecheap, etc.)

You said you already have all four — perfect. Keep them open.

---

## Step 1 — Put the code on GitHub (10 min)

GitHub is like Google Drive, but for code. We're going to create a folder
("repository", or "repo" for short) on GitHub and upload the Shycares files
into it.

### 1.1 Create a new repository

1. Go to **https://github.com/new**
2. **Repository name**: type `shycares-web` (or anything you like)
3. **Description** (optional): `Shycares booking platform`
4. Choose **Private** (so the code isn't visible to the public)
5. **Do NOT check** any of the "Initialize this repository with..." boxes
6. Click the green **Create repository** button at the bottom

You'll land on a page that says "Quick setup" with a bunch of code-looking
commands. Ignore all of that.

### 1.2 Upload the Shycares files

On that same page, look for the small text link that says:

> **uploading an existing file**

Click it. (If you can't find it, the direct URL is `github.com/YOUR-USERNAME/shycares-web/upload/main`)

Now:

1. Open File Explorer on your computer.
2. Navigate to `C:\Users\Kush Gupta\Desktop\Shycares\Shycares\`
3. **Select everything** inside that folder (Ctrl+A).
4. **Drag and drop** all those files into the browser window where it says
   "Drag files here to add them to your repository".

⚠️ **Important**: Make sure you also drag the `app`, `lib`, `supabase` folders
(not just the loose files at the top). GitHub will preserve the folder structure.

5. Wait for the upload to finish (you'll see a progress bar).
6. Scroll down. In the **Commit changes** box, leave the default message.
7. Click the green **Commit changes** button.

**You should now see:** a folder structure on GitHub showing files like
`app`, `lib`, `package.json`, `README.md`, etc. ✅

---

## Step 2 — Set up your Supabase database (15 min)

Supabase is your database — it stores all the groomers, bookings, customers,
and pets. It also handles login/signup for you.

### 2.1 Find your Supabase project

1. Go to https://supabase.com/dashboard
2. Click on your existing project (the one you mentioned you'd already created).
3. If you don't have a project yet, click **New project**:
   - **Name**: `shycares`
   - **Database Password**: click "Generate a password" — **save this somewhere safe** (Notes app is fine)
   - **Region**: choose **South Asia (Mumbai)** for fastest performance in India
   - Click **Create new project**
   - Wait ~2 minutes for it to finish setting up

### 2.2 Run the database setup script

This is the step where we tell Supabase what our tables look like (groomers,
bookings, etc.). It sounds scary but it's literally copy-paste.

1. In your Supabase project, click the **SQL icon** in the left sidebar
   (looks like a database with `</>` on it). It might say "SQL Editor".
2. Click **+ New query** (top right).
3. Open the file `supabase/migrations/0001_init.sql` from the Shycares folder
   on your computer (right-click → Open with → Notepad works fine).
4. **Select all** (Ctrl+A) and **copy** (Ctrl+C) the entire file.
5. Go back to the Supabase SQL editor and **paste** (Ctrl+V) it in.
6. Click the green **RUN** button at the bottom right (or press Ctrl+Enter).
7. Wait ~10 seconds.

**You should see:** a green "Success. No rows returned" message at the bottom. ✅

If you see a red error: don't panic. Most common cause is that you ran it
twice. Tell me the exact error message and I'll fix it.

### 2.3 Save your Supabase keys (you'll need these in Step 4)

1. In the left sidebar, click the **gear icon** (Project Settings).
2. Click **API** in the sub-menu.
3. You'll see three things you need to copy. Open Notepad and label them:
   - **Project URL**: looks like `https://abcdefgh.supabase.co` → label this **SUPABASE URL**
   - **Project API keys → anon public**: a long string starting with `eyJ...` → label this **ANON KEY**
   - **Project API keys → service_role** (click the "Reveal" button): another long `eyJ...` → label this **SERVICE ROLE KEY** ⚠️ Keep this one secret — never share it.

Save the Notepad file. You'll paste these into Vercel in Step 4.

---

## Step 3 — Set up Google Login (15 min)

This is the most fiddly step. Take a deep breath. We're telling Google
"hey, allow people to sign into Shycares with their Google account."

### 3.1 Create Google OAuth credentials

1. Go to https://console.cloud.google.com/
2. At the **top of the page** there's a project dropdown — click it → **New Project**.
   - Name: `Shycares`
   - Click **Create**
3. Wait for the project to be created, then make sure it's selected in the dropdown.
4. In the left sidebar, click **APIs & Services → OAuth consent screen**.
   (If you don't see it, search "OAuth" in the top search bar.)
5. Choose **External**, click **Create**.
6. Fill in only these fields (skip everything else):
   - **App name**: `Shycares`
   - **User support email**: your email
   - **Developer contact email**: your email
   - Click **Save and Continue**.
7. On "Scopes" page, click **Save and Continue** (don't add anything).
8. On "Test users" page, click **+ Add Users** and add your own email
   (this lets you log in while still in test mode). Click **Save and Continue**.
9. Click **Back to Dashboard**.

Now create the actual credentials:

10. In the left sidebar, click **Credentials**.
11. Click **+ Create Credentials → OAuth client ID**.
12. **Application type**: choose **Web application**.
13. **Name**: `Shycares Web`
14. Under **Authorized redirect URIs**, click **+ Add URI** and paste this URL
    (replace `YOUR-PROJECT-REF` with your actual Supabase project reference,
    which is the part of your Supabase URL between `https://` and `.supabase.co`):

    ```
    https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
    ```

    Example: if your Supabase URL is `https://abcdefgh.supabase.co`, paste:
    `https://abcdefgh.supabase.co/auth/v1/callback`

15. Click **Create**.
16. A box pops up showing your **Client ID** and **Client Secret**. Copy both
    into your Notepad file (label them **GOOGLE CLIENT ID** and **GOOGLE CLIENT SECRET**).

### 3.2 Tell Supabase about Google

1. Back in your Supabase project, click **Authentication** in the left sidebar
   (looks like a person icon).
2. Click **Providers** in the sub-menu.
3. Find **Google** in the list and click it to expand.
4. Toggle **Enable Sign in with Google** to ON.
5. Paste your **GOOGLE CLIENT ID** into "Client ID (for OAuth)".
6. Paste your **GOOGLE CLIENT SECRET** into "Client Secret".
7. Click **Save**.

### 3.3 Add the redirect URLs

1. Still in **Authentication**, click **URL Configuration** in the sub-menu.
2. **Site URL**: change it to `https://www.shycares.in`
3. **Redirect URLs**: add these three (one per line, click "Add URL" between each):
   - `https://www.shycares.in/auth/callback`
   - `https://shycares.in/auth/callback`
   - `https://*.vercel.app/auth/callback` (lets you test on Vercel preview URLs)
4. Click **Save**.

**Done with Supabase!** 🎉

---

## Step 4 — Deploy to Vercel (15 min)

Vercel is what actually puts your website on the internet. The good news:
this step is mostly clicking "Next."

### 4.1 Import your GitHub repo

1. Go to https://vercel.com/new
2. You'll see a list of your GitHub repositories. Find **shycares-web** (the
   one you created in Step 1). Click **Import**.
3. If you don't see your repo, click **Adjust GitHub App Permissions** and grant
   Vercel access to your `shycares-web` repo, then come back.

### 4.2 Configure the deployment

You'll see a **"Configure Project"** screen.

1. **Project Name**: `shycares` (or leave the default)
2. **Framework Preset**: should already say **Next.js** ✅
3. **Root Directory**: leave as `./`
4. Expand the **Environment Variables** section. This is where you paste your
   Supabase keys from Step 2.3.

   Add these **four** variables (click "Add" after each):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your **SUPABASE URL** (e.g. `https://abcdefgh.supabase.co`) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your **ANON KEY** (the long `eyJ...` string) |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your **SERVICE ROLE KEY** (the other `eyJ...` string) |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.shycares.in` |

5. Click the **Deploy** button.

Wait 2–4 minutes while Vercel builds your site. You'll see logs scrolling by.

**You should see:** a celebration screen with confetti and a button that says
**"Visit"** with a `*.vercel.app` URL like `shycares-xyz.vercel.app`. ✅

Click "Visit" and confirm the Shycares landing page loads. Don't try to
log in yet — the domain isn't set up.

If the build fails: copy-paste the error from the Vercel logs to me. I'll fix it.

---

## Step 5 — Connect shycares.in (10 min)

Right now your site is live at `something-random.vercel.app`. Let's make it
live at `shycares.in`.

### 5.1 Add the domain in Vercel

1. In your Vercel project dashboard, click **Settings** → **Domains**.
2. Type `shycares.in` and click **Add**.
3. Vercel will show you DNS records. **Don't close this tab.**
4. Type `www.shycares.in` and click **Add** too.

Vercel will tell you something like:
- For `shycares.in`: add an **A record** pointing to `76.76.21.21`
- For `www.shycares.in`: add a **CNAME record** pointing to `cname.vercel-dns.com`

(Yours may show slightly different values — use the ones Vercel actually shows you.)

### 5.2 Update DNS at your domain registrar

This is at BigRock / GoDaddy / wherever you bought `shycares.in`.

1. Log into your registrar.
2. Find the **DNS settings** or **Manage DNS** for `shycares.in`.
3. Delete any existing A or CNAME records that point `@` (or blank) and `www` somewhere else.
4. Add the records Vercel asked for:
   - **A record**: Host = `@`, Value = `76.76.21.21`, TTL = default
   - **CNAME record**: Host = `www`, Value = `cname.vercel-dns.com`, TTL = default
5. Save.

### 5.3 Wait

DNS changes take **5 minutes to 24 hours** to propagate (usually under an hour
for `.in` domains). Go back to Vercel's Domains page — when both domains show
a green checkmark, you're live.

You can check by typing `https://www.shycares.in` in a private/incognito window.

---

## Step 6 — Smoke test (5 min)

Go to `https://www.shycares.in` in **Incognito mode** (so no cached stuff).

1. ✅ Landing page loads
2. Click **Get started** or **Log in** → click **Continue with Google**
3. Sign in with your Google account → you should land on the **onboarding form**
4. Fill it out (use slug `demo` for now) → click **Create my booking page**
5. You should land on the **dashboard** with a "Your booking page is live!" banner
6. Open `https://www.shycares.in/demo` in another incognito tab → your microsite should appear
7. Click **Book an appointment**, fill the form with fake info, submit
8. Go back to the dashboard — your test booking should appear in today's calendar

If all 8 work: **you're ready to onboard your first real groomer.** 🎉

---

## 🚨 What to do if something breaks

**Don't panic.** I'll help. When you hit an error, send me:

1. **Which step number** you were on
2. **What you tried**
3. A **screenshot** of the error (or copy-paste the exact error text)

The 3 most common issues and quick fixes:

### "Authorization Error" or "redirect_uri_mismatch" when clicking Google login
Your callback URL in Google Cloud doesn't match what Supabase expects. Re-check
Step 3.1 #14 — the URL must be exactly `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`.

### "An error occurred" after Google login redirect
Your redirect URLs in **Supabase Auth → URL Configuration** don't include your
real domain yet. Re-check Step 3.3.

### Vercel build fails
Almost always one of the four environment variables is missing or has a typo.
Go to Vercel → Settings → Environment Variables, double-check all four are
present, then trigger a redeploy: **Deployments tab → ⋯ menu → Redeploy**.

---

## Glossary

- **Repository / repo** — a folder of code on GitHub
- **Deploy** — make a website live on the internet
- **Database** — where Shycares stores groomers, bookings, customers
- **Environment variable** — a setting (like a password) that the app reads at startup
- **OAuth** — the system that lets people log in with their Google account
- **DNS** — the address book of the internet, maps `shycares.in` → server IP
- **CNAME / A record** — types of DNS entries

---

Once you're live, open `GO_TO_MARKET.md` for the day-by-day plan to your
first paying customer by Sunday 17 May. 🐾
