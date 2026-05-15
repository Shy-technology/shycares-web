"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { acknowledgeEvent, recordBookingEvent } from "@/lib/notifications";
import type { BookingStatus } from "@/lib/types";

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  reason?: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  // Load business_id for the event log
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, business_id, status")
    .eq("id", bookingId)
    .single();
  if (!booking) return { ok: false, error: "Booking not found" };

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);
  if (error) return { ok: false, error: error.message };

  // Log significant state changes
  if (status === "cancelled" && booking.status !== "cancelled") {
    await recordBookingEvent(supabase, {
      booking_id: bookingId,
      business_id: booking.business_id,
      event_type: "cancelled_by_owner",
      actor: "owner",
      reason: reason ?? null,
    });
  } else if (status === "completed" && booking.status !== "completed") {
    await recordBookingEvent(supabase, {
      booking_id: bookingId,
      business_id: booking.business_id,
      event_type: "completed",
      actor: "owner",
    });
  } else if (status === "no_show" && booking.status !== "no_show") {
    await recordBookingEvent(supabase, {
      booking_id: bookingId,
      business_id: booking.business_id,
      event_type: "no_show",
      actor: "owner",
    });
  }

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function acknowledgeBookingEvent(eventId: string) {
  const supabase = await createClient();
  await acknowledgeEvent(supabase, eventId);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function acknowledgeAllEvents() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();
  if (!business) return { ok: false };
  await supabase
    .from("booking_events")
    .update({ acknowledged_at: new Date().toISOString() })
    .eq("business_id", business.id)
    .is("acknowledged_at", null);
  revalidatePath("/dashboard");
  return { ok: true };
}
