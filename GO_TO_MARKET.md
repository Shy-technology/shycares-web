# Shycares — First Customer Playbook

**Goal:** First paid customer (₹499 or whatever you settle on) by **Sunday, 17 May 2026**.

You said you have a specific groomer in mind. This doc is a daily plan from
today (Sun, 10 May) through next weekend.

---

## Day 0 — Tonight (Sun, 10 May)

**Ship the product.** Follow `README.md` ship-it checklist (~1 hour).

End-of-day proof points:
- [ ] `https://www.shycares.in` loads the marketing page
- [ ] You can sign in with your own Google account
- [ ] You created a test microsite at `shycares.in/demo`
- [ ] You submitted a test booking and saw it in the dashboard

If any of those fail — fix them tonight. Don't pitch a broken product.

---

## Day 1 — Mon, 11 May: Reach out

**Don't ask for money yet. Ask for 15 minutes.**

WhatsApp message to send:
> Hi [Name]! I've been working on a small thing that might save you time.
> It's a free booking page + calendar built specifically for groomers in India
> — your customers can book appointments online instead of clogging your DMs,
> and you get reminded automatically. I built it because [your honest story].
>
> Could I show you a 10-min demo this week? I'll set it up free for you.

Goals for the call:
1. Get them to **say yes to trying it for a week**
2. Walk through their existing booking process — note every pain point
3. Get permission to use their photos and 3 service prices

---

## Day 2 — Tue, 12 May: Build their site

Set up their microsite **for them**. Don't make them do the form.

Pre-fill:
- Business name, slug (`shycares.in/their-handle`)
- 3–6 services with their actual prices
- Their hours
- 3–5 photos (ask them to send via WhatsApp; upload via Settings)
- Their phone + WhatsApp number

Send them the link via WhatsApp:
> Hey, your page is live: shycares.in/[slug]
> Try clicking "Book appointment" on your phone — does the flow feel right
> for your customers? Tell me anything that's off.

---

## Day 3 — Wed, 13 May: Drive 1 real booking

**The win condition: a real customer makes a real booking.**

Two ways:
1. **Easiest**: their next 3 customers who DM them, you reply (from their phone or via them):
   > "Yes! Book your slot here so I have the right time blocked: shycares.in/[slug]"
2. **Bigger swing**: have them post their booking link on Instagram Story today.
   Format: photo of a happy dog + "✨ NEW: book online → link in bio".

When the first booking lands, send them a screenshot:
> Look! 🎉 First online booking. Confirm with the WhatsApp button.

This emotional moment matters — they'll feel the magic.

---

## Day 4 — Thu, 14 May: Polish + remove friction

Watch your dashboard. Things that matter:
- Bookings created vs. bookings confirmed (drop-off = trust issue)
- Time-to-confirm by groomer (slow = the dashboard isn't sticky enough)

Fix one piece of friction. Push to Vercel. Tell them what you fixed.

This is where you earn the "they tell their groomer friends" reward.

---

## Day 5 — Fri, 15 May: Get the second booking

By now they should be sharing the link organically. If not:
- Suggest pinning the link in Instagram bio
- Suggest sending it as a WhatsApp Status

Goal: 5+ bookings landed by end of Friday.

---

## Day 6 — Sat, 16 May: The ask

If they've used it for 5 days and got real bookings, **ask for the money**.

Pitch script:
> [Name] — you've gotten [X] bookings through the page this week. Going forward
> it's ₹499/month — that's less than one full grooming. Want to lock in
> beta pricing (₹499/mo for life, even when we raise prices later)?

Don't build payments yet. Send a Razorpay payment link manually:
- Open Razorpay → Payment Links → Create
- Amount: ₹499, description: "Shycares — May 2026"
- Send via WhatsApp

When they pay → you have your **first paid customer**. ✅

---

## Day 7 — Sun, 17 May: Tell the world

The single highest-leverage thing tomorrow:

1. Get a **2-sentence quote** from your customer:
   > "I lost so many bookings in DMs before. Now my Saturdays book themselves." — Riya, Happy Paws Mumbai
2. Take a phone photo of them at work + a screenshot of their microsite.
3. Post on **LinkedIn + Twitter + Instagram** with:
   > Built Shycares this week — a booking page for solo groomers. First customer
   > [@theirhandle] just paid. If you know any solo groomers / boarders / vets
   > in India who'd want this, please tag them.
4. Reply to every comment / DM. Onboard customer #2 next week.

---

## Customer #1 lessons to capture

After the week, save in `learnings.md`:
- The **one feature** they used the most → double down on it
- The **one thing** they asked for that we don't have → next sprint
- The **one thing** that confused them on the microsite → fix this week
- Their **exact words** describing the value → this is your homepage copy
