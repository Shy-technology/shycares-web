import Link from "next/link";
import {
  CalendarDays,
  Globe,
  HeartHandshake,
  MessageCircle,
  PawPrint,
  Sparkles,
  Star,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-cream-50">
      <SiteNav />
      <Hero />
      <SocialProof />
      <FeatureGrid />
      <HowItWorks />
      <Testimonial />
      <Pricing />
      <FinalCta />
      <SiteFooter />
    </main>
  );
}

/* -------------------- Nav -------------------- */
function SiteNav() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-cream-50/80 border-b border-ink/5">
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-peach-500 grid place-items-center shadow-warm">
            <PawPrint className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-semibold">Shycares</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-ink-soft">
          <a href="#features" className="hover:text-ink">Features</a>
          <a href="#how" className="hover:text-ink">How it works</a>
          <a href="#pricing" className="hover:text-ink">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-ghost text-sm">Log in</Link>
          <Link href="/login" className="btn-primary text-sm">Get started</Link>
        </div>
      </div>
    </header>
  );
}

/* -------------------- Hero -------------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-peach-200/60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-sage-100 blur-3xl" />
      </div>
      <div className="mx-auto max-w-6xl px-5 pt-16 md:pt-24 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="chip mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Built for solo pet care pros in India
          </div>
          <h1 className="text-5xl md:text-6xl leading-[1.05] font-semibold">
            Your pet care business,{" "}
            <span className="text-peach-500">online in 10 minutes.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-soft max-w-lg">
            A beautiful booking page, a calendar that organizes your day, and
            customer records that remember every pet. Built for groomers,
            boarders, and vets running solo.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/login" className="btn-primary">
              Create your free page
            </Link>
            <a href="#how" className="btn-secondary">See how it works</a>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
            <Star className="h-4 w-4 fill-peach-400 text-peach-400" />
            No credit card. Free while we&rsquo;re in beta.
          </div>
        </div>

        {/* Mock microsite preview */}
        <MicrositePreview />
      </div>
    </section>
  );
}

function MicrositePreview() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-peach-100 to-sage-100" />
      <div className="relative rounded-[2rem] bg-white shadow-soft overflow-hidden ring-1 ring-ink/5">
        <div className="h-32 bg-gradient-to-br from-peach-300 via-peach-200 to-sage-200 relative">
          <div className="absolute -bottom-6 left-5 h-16 w-16 rounded-2xl bg-white grid place-items-center shadow-soft">
            <PawPrint className="h-8 w-8 text-peach-500" />
          </div>
        </div>
        <div className="px-5 pt-10 pb-6">
          <h3 className="font-display text-2xl">Happy Paws Grooming</h3>
          <p className="text-sm text-ink-soft mt-1">Bandra West &middot; Mumbai</p>
          <div className="mt-4 flex gap-2">
            <span className="chip">⭐ 4.9</span>
            <span className="chip">320+ pets</span>
            <span className="chip">Open today</span>
          </div>
          <div className="mt-5 space-y-2">
            {[
              { name: "Full grooming", price: "₹1,200", time: "90 min" },
              { name: "Bath & blow dry", price: "₹600", time: "45 min" },
              { name: "Nail trim", price: "₹250", time: "15 min" },
            ].map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between rounded-xl bg-cream-100 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-ink-muted">{s.time}</p>
                </div>
                <span className="font-semibold text-peach-500">{s.price}</span>
              </div>
            ))}
          </div>
          <button className="btn-primary w-full mt-5">Book appointment</button>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Social proof -------------------- */
function SocialProof() {
  return (
    <section className="py-10 border-y border-ink/5 bg-white">
      <div className="mx-auto max-w-6xl px-5 flex flex-wrap items-center justify-center gap-8 md:gap-16 text-ink-muted text-sm">
        <span>Loved by solo groomers in</span>
        <span className="font-semibold text-ink">Mumbai</span>
        <span className="font-semibold text-ink">Bengaluru</span>
        <span className="font-semibold text-ink">Delhi</span>
        <span className="font-semibold text-ink">Pune</span>
        <span className="font-semibold text-ink">Hyderabad</span>
      </div>
    </section>
  );
}

/* -------------------- Features -------------------- */
function FeatureGrid() {
  const features = [
    {
      icon: Globe,
      title: "Your own microsite",
      body: "A beautiful, mobile-first booking page at shycares.in/yourname. Share it on Instagram, WhatsApp, anywhere.",
    },
    {
      icon: CalendarDays,
      title: "Calendar that thinks ahead",
      body: "See today, tomorrow, this week. Confirm or reschedule with one tap. No more missed appointments.",
    },
    {
      icon: HeartHandshake,
      title: "Remembers every pet",
      body: "Auto-save customer details and pet history (breed, allergies, last visit). Repeat bookings in seconds.",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp reminders",
      body: "One-tap reminder messages your customers actually read. No expensive SMS, no marketing apps.",
    },
  ];
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="text-peach-500 font-medium text-sm">Features</p>
          <h2 className="text-4xl mt-2">Everything you need. Nothing you don&rsquo;t.</h2>
          <p className="mt-3 text-ink-soft">
            We built Shycares for the groomer working out of a small studio,
            the boarder running it from home, the vet doing house calls. The
            essentials, done well.
          </p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="card hover:shadow-warm transition-shadow">
              <div className="h-11 w-11 rounded-xl bg-peach-100 grid place-items-center text-peach-500">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg mt-4 font-display">{f.title}</h3>
              <p className="text-sm text-ink-soft mt-1.5 leading-relaxed">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- How it works -------------------- */
function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Sign up with Google",
      body: "One click. No password to remember.",
    },
    {
      n: "2",
      title: "Tell us about your business",
      body: "Add your services, prices, hours, and a few photos.",
    },
    {
      n: "3",
      title: "Share your booking link",
      body: "Drop it in your Instagram bio and watch the bookings roll in.",
    },
  ];
  return (
    <section id="how" className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="text-sage-500 font-medium text-sm">How it works</p>
          <h2 className="text-4xl mt-2">Three steps. Done before chai is cold.</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl bg-cream-50 p-7 ring-1 ring-ink/5">
              <div className="text-5xl font-display text-peach-500">{s.n}</div>
              <h3 className="text-xl mt-3 font-display">{s.title}</h3>
              <p className="text-ink-soft mt-1.5">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Testimonial (placeholder until real one) -------------------- */
function Testimonial() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <div className="flex justify-center gap-1 text-peach-400 mb-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-peach-400" />
          ))}
        </div>
        <p className="text-2xl md:text-3xl font-display leading-snug">
          &ldquo;I used to lose half my bookings in DM threads. Now my Instagram bio
          link does the work for me, and my Saturdays are full a week ahead.&rdquo;
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-full bg-sage-200 grid place-items-center">
            <PawPrint className="h-5 w-5 text-sage-500" />
          </div>
          <div className="text-left">
            <p className="font-medium">Riya — Happy Paws Grooming</p>
            <p className="text-sm text-ink-muted">Bandra West, Mumbai</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Pricing -------------------- */
function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-cream-100">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <p className="text-peach-500 font-medium text-sm">Pricing</p>
        <h2 className="text-4xl mt-2">Free during beta. Then ₹499/month.</h2>
        <p className="mt-3 text-ink-soft">
          Sign up now and lock in beta pricing. No credit card required, cancel anytime.
        </p>
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          <div className="card text-left">
            <h3 className="font-display text-2xl">Beta — Free</h3>
            <p className="text-sm text-ink-soft mt-1">Ship now, pay later.</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              <li>✓ Your own booking microsite</li>
              <li>✓ Calendar dashboard</li>
              <li>✓ Customer + pet records</li>
              <li>✓ WhatsApp reminder links</li>
              <li>✓ Unlimited bookings</li>
            </ul>
            <Link href="/login" className="btn-primary w-full mt-6">
              Start free
            </Link>
          </div>
          <div className="card text-left ring-2 ring-peach-300 relative">
            <span className="absolute -top-3 right-5 chip bg-peach-500 text-white">Coming soon</span>
            <h3 className="font-display text-2xl">Pro — ₹499/mo</h3>
            <p className="text-sm text-ink-soft mt-1">Everything plus payments.</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              <li>✓ Everything in Beta</li>
              <li>✓ Razorpay UPI payments</li>
              <li>✓ Automated WhatsApp reminders</li>
              <li>✓ Custom domain</li>
              <li>✓ Email + WhatsApp support</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Final CTA -------------------- */
function FinalCta() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <h2 className="text-4xl md:text-5xl">Ready to put your bookings on autopilot?</h2>
        <p className="mt-4 text-ink-soft max-w-xl mx-auto">
          Join the beta. We&rsquo;ll set you up personally — usually within an hour of signup.
        </p>
        <Link href="/login" className="btn-primary mt-8 px-8 py-4 text-lg">
          Create my booking page
        </Link>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-ink/5 py-10 text-sm text-ink-muted">
      <div className="mx-auto max-w-6xl px-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <PawPrint className="h-4 w-4 text-peach-500" />
          <span>© {new Date().getFullYear()} Shycares</span>
        </div>
        <div className="flex gap-5">
          <a href="mailto:hello@shycares.in" className="hover:text-ink">hello@shycares.in</a>
          <Link href="/login" className="hover:text-ink">Log in</Link>
        </div>
      </div>
    </footer>
  );
}
