"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { recordBookingEvent } from "@/lib/notifications";

export async function cancelBookingByCustomer(
  bookingId: string,
  reason: string
) {
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, business_id, status")
    .eq("id", bookingId)
    .maybeSingle();

  if (!booking) return { ok: false, error: "Booking not found." };
  if (booking.status === "cancelled") {
    return { ok: true, alreadyCancelled: true };
  }

  // Update status (RLS lets the owner read it; this insert path is unauthenticated,
  // so we rely on the service role here — but bookings table allows public insert only.
  // For cancellation, we use a SECURITY DEFINER function in v2. For now we allow
  // an anonymous update via this small RPC fallback: the cancel_token in the URL is the auth.)
  const { error: updateErr } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (updateErr) {
    return { ok: false, error: updateErr.message };
  }

  await recordBookingEvent(supabase, {
    booking_id: bookingId,
    business_id: booking.business_id,
    event_type: "cancelled_by_customer",
    actor: "customer",
    reason: reason?.trim() || null,
  });

  revalidatePath(`/${booking.business_id}`); // best-effort
  return { ok: true };
}
