import { redirect } from "next/navigation";
import { addDays, endOfDay, format, startOfDay } from "date-fns";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  PawPrint,
  Phone,
  Sparkles,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, whatsappLink } from "@/lib/utils";
import BookingActions from "./BookingActions";
import Link from "next/link";

type SP = { searchParams: Promise<{ welcome?: string; date?: string }> };

export default async function DashboardPage({ searchParams }: SP) {
  const sp = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, slug, whatsapp_number")
    .eq("owner_id", user.id)
    .single();
  if (!business) redirect("/onboarding");

  // Date selection — default today
  const selected = sp.date ? new Date(sp.date) : new Date();
  const dayStart = startOfDay(selected).toISOString();
  const dayEnd = endOfDay(selected).toISOString();

  // Fetch bookings for the selected day with joined details
  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      `id, starts_at, ends_at, status, notes,
       customer:customers(id, name, phone, email),
       pet:pets(id, name, breed, species, notes),
       service:services(id, name, price, duration_min)`
    )
    .eq("business_id", business.id)
    .gte("starts_at", dayStart)
    .lte("starts_at", dayEnd)
    .order("starts_at", { ascending: true });

  // Fetch summary counts
  const { count: totalPending } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("business_id", business.id)
    .eq("status", "pending");

  const { count: totalUpcoming } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("business_id", business.id)
    .gte("starts_at", new Date().toISOString())
    .in("status", ["pending", "confirmed"]);

  // Render the next 14 days as date pills
  const days = Array.from({ length: 14 }, (_, i) => addDays(startOfDay(new Date()), i));

  return (
    <div className="px-5 md:px-10 py-6 md:py-10 max-w-6xl">
      {sp.welcome === "1" && <WelcomeBanner slug={business.slug} />}

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Calendar</h1>
          <p className="text-ink-soft mt-1">{business.name}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${business.slug}`} target="_blank" className="btn-secondary text-sm">
            <ExternalLink className="h-4 w-4 mr-1.5" /> View booking page
          </Link>
        </div>
      </header>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Pending requests"
          value={totalPending ?? 0}
          accent="peach"
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Upcoming bookings"
          value={totalUpcoming ?? 0}
          accent="sage"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Today"
          value={bookings?.length ?? 0}
          accent="ink"
        />
      </div>

      {/* Day picker */}
      <div className="mt-8 -mx-5 md:mx-0">
        <div className="flex gap-2 overflow-x-auto px-5 md:px-0 pb-2 snap-x">
          {days.map((d) => {
            const isSelected = format(d, "yyyy-MM-dd") === format(selected, "yyyy-MM-dd");
            return (
              <Link
                key={d.toISOString()}
                href={`/dashboard?date=${format(d, "yyyy-MM-dd")}`}
                className={`flex-none snap-start w-16 rounded-2xl p-3 text-center transition-colors ${
                  isSelected
                    ? "bg-peach-500 text-white shadow-warm"
                    : "bg-white text-ink ring-1 ring-ink/5 hover:bg-cream-100"
                }`}
              >
                <div className="text-[11px] uppercase tracking-wide opacity-80">
                  {format(d, "EEE")}
                </div>
                <div className="font-display text-2xl mt-1">{format(d, "d")}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bookings list for selected day */}
      <section className="mt-6">
        <h2 className="font-display text-xl mb-3">
          {format(selected, "EEEE, d MMMM")}
        </h2>
        {(!bookings || bookings.length === 0) && <EmptyDay />}
        <div className="space-y-3">
          {bookings?.map((b: any) => (
            <BookingCard
              key={b.id}
              booking={b}
              businessName={business.name}
              ownerWhatsapp={business.whatsapp_number}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function WelcomeBanner({ slug }: { slug: string }) {
  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-r from-peach-100 to-sage-100 p-5 ring-1 ring-ink/5">
      <div className="flex items-start gap-3">
        <Sparkles className="h-6 w-6 text-peach-500 flex-none mt-0.5" />
        <div>
          <h3 className="font-display text-xl">Your booking page is live!</h3>
          <p className="text-sm text-ink-soft mt-1">
            Share this link in your Instagram bio, WhatsApp status, and with your customers:{" "}
            <a
              href={`/${slug}`}
              target="_blank"
              className="font-mono font-semibold text-peach-500 hover:underline"
            >
              shycares.in/{slug}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: "peach" | "sage" | "ink";
}) {
  const accents = {
    peach: "bg-peach-100 text-peach-500",
    sage: "bg-sage-100 text-sage-500",
    ink: "bg-cream-100 text-ink",
  } as const;
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`h-11 w-11 rounded-xl grid place-items-center ${accents[accent]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
        <p className="font-display text-2xl">{value}</p>
      </div>
    </div>
  );
}

function EmptyDay() {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-ink/5 p-10 text-center">
      <CalendarDays className="h-10 w-10 text-ink-muted mx-auto" />
      <p className="font-display text-xl mt-3">No bookings yet</p>
      <p className="text-sm text-ink-soft mt-1 max-w-sm mx-auto">
        Share your booking page link with customers to start receiving requests.
      </p>
    </div>
  );
}

function BookingCard({
  booking,
  businessName,
  ownerWhatsapp,
}: {
  booking: any;
  businessName: string;
  ownerWhatsapp: string;
}) {
  const start = new Date(booking.starts_at);
  const end = new Date(booking.ends_at);
  const customer = booking.customer;
  const pet = booking.pet;
  const service = booking.service;

  const reminderText = `Hi ${customer.name}! 🐾 Just a friendly reminder about your appointment with ${businessName} on ${format(
    start,
    "EEE, d MMM"
  )} at ${format(start, "h:mm a")} for ${service.name}. See you soon!`;

  const confirmText = `Hi ${customer.name}! 🐾 Your booking with ${businessName} for ${service.name} on ${format(
    start,
    "EEE, d MMM"
  )} at ${format(start, "h:mm a")} is confirmed. See you then!`;

  return (
    <div className="rounded-2xl bg-white ring-1 ring-ink/5 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Time strip */}
        <div className="md:w-32 bg-cream-100 p-4 md:py-5 md:px-5 flex md:flex-col items-center justify-between md:justify-center gap-2 md:gap-1">
          <div className="font-display text-2xl">{format(start, "h:mm")}</div>
          <div className="text-xs uppercase tracking-wide text-ink-muted">
            {format(start, "a")} • {service.duration_min} min
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="flex-1 p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg">{customer.name}</h3>
                {pet && (
                  <span className="chip">
                    <PawPrint className="h-3 w-3" />
                    {pet.name}
                    {pet.breed && ` • ${pet.breed}`}
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-soft mt-1">
                {service.name} · <span className="font-semibold text-ink">{formatPrice(service.price)}</span>
              </p>
              {booking.notes && (
                <p className="text-sm text-ink-muted mt-2 bg-cream-100 rounded-lg px-3 py-2">
                  &ldquo;{booking.notes}&rdquo;
                </p>
              )}
            </div>
            <a
              href={`tel:${customer.phone}`}
              className="btn-ghost text-sm"
              aria-label={`Call ${customer.name}`}
            >
              <Phone className="h-4 w-4 mr-1.5" /> {customer.phone}
            </a>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <BookingActions
              bookingId={booking.id}
              status={booking.status}
              confirmWhatsappLink={whatsappLink(customer.phone, confirmText)}
              reminderWhatsappLink={whatsappLink(customer.phone, reminderText)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Pending", cls: "bg-peach-100 text-peach-500" },
    confirmed: { label: "Confirmed", cls: "bg-sage-100 text-sage-500" },
    completed: { label: "Done", cls: "bg-ink/5 text-ink-soft" },
    cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-600" },
    no_show: { label: "No-show", cls: "bg-red-50 text-red-600" },
  };
  const m = map[status] ?? map.pending;
  return (
    <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-semibold ${m.cls}`}>
      {m.label}
    </span>
  );
}
