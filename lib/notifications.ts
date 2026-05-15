/**
 * Centralized notification dispatcher.
 *
 * For v1.1 this only writes to the booking_events table (which the dashboard
 * reads to show banners + count badges).
 *
 * In v1.2, after Meta tech provider approval, the `sendWhatsApp` function
 * below will be implemented to actually push messages to the groomer's
 * phone via WhatsApp Cloud API. The call sites won't need to change.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type NotificationType =
  | "cancelled_by_customer"
  | "cancelled_by_owner"
  | "rescheduled"
  | "completed"
  | "no_show";

export async function recordBookingEvent(
  supabase: SupabaseClient,
  args: {
    booking_id: string;
    business_id: string;
    event_type: NotificationType;
    actor: "customer" | "owner";
    reason?: string | null;
    metadata?: Record<string, unknown>;
  }
) {
  const { error } = await supabase.from("booking_events").insert({
    booking_id: args.booking_id,
    business_id: args.business_id,
    event_type: args.event_type,
    actor: args.actor,
    reason: args.reason ?? null,
    metadata: args.metadata ?? {},
  });
  if (error) return { ok: false, error: error.message };

  // STUB: once Meta tech provider is approved, send WhatsApp to groomer
  // await sendWhatsApp(business.whatsapp_number, buildCancelMessage(args));

  return { ok: true };
}

/**
 * Mark a booking_event as seen by the groomer.
 */
export async function acknowledgeEvent(
  supabase: SupabaseClient,
  eventId: string
) {
  return supabase
    .from("booking_events")
    .update({ acknowledged_at: new Date().toISOString() })
    .eq("id", eventId);
}

/**
 * STUB — Implemented in v1.2 after Meta tech provider approval.
 * Will call WhatsApp Cloud API:
 *   POST https://graph.facebook.com/v20.0/{phone_number_id}/messages
 *   Authorization: Bearer {WHATSAPP_TOKEN}
 *   Body: { messaging_product: "whatsapp", to, type: "template", template: {...} }
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _sendWhatsAppStub(_to: string, _message: string) {
  if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_ID) {
    return { ok: false, reason: "whatsapp_not_configured" };
  }
  // implementation goes here
  return { ok: true };
}
