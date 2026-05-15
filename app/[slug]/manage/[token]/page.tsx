import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { CalendarHeart, MessageCircle, PawPrint } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { whatsappLink } from "@/lib/utils";
import CancelButton from "./CancelButton";

export default async function ManageBookingPage({
  params,
}: {
  params: Promise<{ slug: string; token: string }>;
}) {
  const { slug, token } = await params;

  const supabase = await createClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select(
      `id, starts_at, ends_at, status, notes,
       business:businesses(id, name, slug, whatsapp_number, profile_photo_url),
       service:services(name, price, duration_min),
       customer:customers(name, phone),
       pet:pets(name)`
    )
    .eq("cancel_token", token)
    .maybeSingle();

  if (!booking) notFound();
  const business: any = booking.business;
  const service: any = booking.service;
  const customer: any = booking.customer;
  const pet: any = booking.pet;

  // Slug mismatch safety
  if (business.slug !== slug) notFound();

  const isCancelled = booking.status === "cancelled";
  const isPast = new Date(booking.ends_at) < new Date();

  const rescheduleMsg = `Hi ${business.name}, I'd like to reschedule my booking for ${
    service.name
  } on ${format(new Date(booking.starts_at), "EEE, d MMM @ h:mm a")}. Could we find another time?`;

  return (
    <main className="min-h-screen bg-cream-50 px-5 py-10">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-6">
          <div className="h-16 w-16 rounded-3xl bg-white shadow-soft grid place-items-center mx-auto overflow-hidden">
            {business.profile_photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={business.profile_photo_url}
                alt={business.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <PawPrint className="h-8 w-8 text-peach-500" />
            )}
          </div>
          <h1 className="font-display text-2xl mt-4">Your booking</h1>
          <p className="text-ink-soft text-sm">with {business.name}</p>
        </div>

        <div className="card space-y-4">
          {isCancelled && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm font-medium text-center">
              This booking has been cancelled.
            </div>
          )}
          {isPast && !isCancelled && (
            <div className="rounded-xl bg-cream-100 text-ink-soft px-3 py-2 text-sm text-center">
              This appointment has already passed.
            </div>
          )}

          <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted">Customer</p>
            <p className="font-medium">{customer.name}</p>
            {pet && <p className="text-sm text-ink-soft">Pet: {pet.name}</p>}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted">Service</p>
            <p className="font-medium">{service.name}</p>
            <p className="text-sm text-ink-soft">{service.duration_min} min</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted">Time</p>
            <p className="font-medium">
              {format(new Date(booking.starts_at), "EEEE, d MMMM")}
            </p>
            <p className="text-sm text-ink-soft">
              {format(new Date(booking.starts_at), "h:mm a")}
            </p>
          </div>

          {!isCancelled && !isPast && (
            <div className="pt-3 border-t border-ink/5 space-y-2">
              <a
                href={whatsappLink(business.whatsapp_number, rescheduleMsg)}
                target="_blank"
                rel="noopener"
                className="btn-secondary w-full"
              >
                <MessageCircle className="h-4 w-4 mr-1.5" /> Message to reschedule
              </a>
              <CancelButton bookingId={booking.id} businessId={business.id} />
            </div>
          )}
        </div>

        <Link href={`/${slug}`} className="block text-center mt-6 text-sm text-ink-soft hover:text-ink">
          ← Back to {business.name}
        </Link>
      </div>
    </main>
  );
}
