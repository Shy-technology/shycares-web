import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { CheckCircle2, MessageCircle, PawPrint } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { whatsappLink } from "@/lib/utils";

export default async function BookingConfirmedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ b?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  if (!sp.b) notFound();

  const supabase = await createClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select(
      `id, starts_at, status,
       business:businesses(name, whatsapp_number, slug),
       service:services(name)`
    )
    .eq("id", sp.b)
    .maybeSingle();

  if (!booking) notFound();
  const business: any = booking.business;
  const service: any = booking.service;

  const message = `Hi ${business.name}! I just submitted a booking request for ${service.name} on ${format(
    new Date(booking.starts_at),
    "EEE, d MMM @ h:mm a"
  )}. Looking forward to your confirmation!`;

  return (
    <main className="min-h-screen bg-cream-50 grid place-items-center px-5">
      <div className="max-w-md w-full text-center">
        <div className="h-16 w-16 rounded-3xl bg-sage-100 grid place-items-center mx-auto">
          <CheckCircle2 className="h-8 w-8 text-sage-500" />
        </div>
        <h1 className="font-display text-3xl mt-5">Request sent! 🐾</h1>
        <p className="text-ink-soft mt-2">
          {business.name} will confirm your appointment via WhatsApp shortly.
        </p>

        <div className="card mt-6 text-left">
          <p className="text-xs uppercase tracking-wide text-ink-muted">Service</p>
          <p className="font-medium">{service.name}</p>
          <p className="text-xs uppercase tracking-wide text-ink-muted mt-3">Time</p>
          <p className="font-medium">{format(new Date(booking.starts_at), "EEEE, d MMMM · h:mm a")}</p>
        </div>

        <a
          href={whatsappLink(business.whatsapp_number, message)}
          target="_blank"
          className="btn-primary w-full mt-5"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Message {business.name} on WhatsApp
        </a>

        <Link href={`/${slug}`} className="block mt-3 text-sm text-ink-soft hover:text-ink">
          ← Back to {business.name}
        </Link>
      </div>
    </main>
  );
}
