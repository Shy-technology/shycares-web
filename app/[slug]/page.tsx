import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  MapPin,
  MessageCircle,
  PawPrint,
  Phone,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, whatsappLink, RESERVED_SLUGS } from "@/lib/utils";
import type { BusinessHours } from "@/lib/types";

const DAY_NAMES: { key: keyof BusinessHours; label: string }[] = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

export default async function MicrositePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) notFound();

  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!business) notFound();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", business.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const hours = business.business_hours as BusinessHours;

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Cover */}
      <section className="relative">
        <div className="h-44 md:h-60 bg-gradient-to-br from-peach-300 via-peach-200 to-sage-200" />
        <div className="mx-auto max-w-3xl px-5">
          <div className="-mt-12 flex items-end gap-4">
            <div className="h-24 w-24 rounded-3xl bg-white grid place-items-center shadow-soft ring-4 ring-cream-50">
              <PawPrint className="h-12 w-12 text-peach-500" />
            </div>
            <div className="pb-2">
              <h1 className="font-display text-3xl md:text-4xl">{business.name}</h1>
              {business.tagline && (
                <p className="text-ink-soft mt-1">{business.tagline}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {business.city && (
              <span className="chip">
                <MapPin className="h-3 w-3" /> {business.city}
              </span>
            )}
            <a href={`tel:${business.phone}`} className="chip hover:bg-cream-200">
              <Phone className="h-3 w-3" /> {business.phone}
            </a>
            <a
              href={whatsappLink(
                business.whatsapp_number,
                `Hi! I'd like to book an appointment with ${business.name}.`
              )}
              target="_blank"
              className="chip hover:bg-cream-200"
            >
              <MessageCircle className="h-3 w-3" /> WhatsApp
            </a>
          </div>

          {business.description && (
            <p className="mt-5 text-ink-soft leading-relaxed">{business.description}</p>
          )}
        </div>
      </section>

      {/* Services + booking CTA */}
      <section className="mx-auto max-w-3xl px-5 mt-10">
        <h2 className="font-display text-2xl mb-4">Services</h2>
        <div className="space-y-2">
          {services?.map((s) => (
            <Link
              key={s.id}
              href={`/${slug}/book?service=${s.id}`}
              className="card flex items-center justify-between gap-4 hover:shadow-warm transition-shadow group"
            >
              <div>
                <h3 className="font-medium">{s.name}</h3>
                {s.description && (
                  <p className="text-sm text-ink-soft mt-0.5">{s.description}</p>
                )}
                <p className="text-xs text-ink-muted mt-1 inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {s.duration_min} min
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-xl text-peach-500">{formatPrice(s.price)}</p>
                <p className="text-xs text-ink-muted mt-1 group-hover:text-peach-500">Book →</p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href={`/${slug}/book`}
          className="btn-primary w-full mt-6 text-base py-4"
        >
          Book an appointment
        </Link>
      </section>

      {/* Hours */}
      <section className="mx-auto max-w-3xl px-5 mt-10">
        <h2 className="font-display text-2xl mb-4">Hours</h2>
        <div className="card divide-y divide-ink/5">
          {DAY_NAMES.map((d) => {
            const h = hours[d.key];
            return (
              <div key={d.key} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <span>{d.label}</span>
                <span className="text-ink-soft text-sm">
                  {h.closed ? "Closed" : `${h.open} – ${h.close}`}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="mt-16 py-10 text-center text-xs text-ink-muted">
        <p>
          Powered by{" "}
          <Link href="/" className="font-semibold hover:text-peach-500">
            Shycares
          </Link>
        </p>
      </footer>
    </main>
  );
}
