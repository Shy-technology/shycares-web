"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { addMinutes } from "date-fns";
import { createClient } from "@/lib/supabase/server";

const BookingSchema = z.object({
  business_id: z.string().uuid(),
  service_id: z.string().uuid(),
  starts_at: z.string(), // ISO
  customer_name: z.string().min(2).max(80),
  customer_phone: z.string().min(8).max(20),
  customer_email: z.string().email().optional().or(z.literal("")),
  pet_name: z.string().min(1).max(40),
  pet_species: z.string().default("dog"),
  pet_breed: z.string().optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type CreateBookingState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createBooking(
  _prev: CreateBookingState,
  formData: FormData
): Promise<CreateBookingState> {
  const raw = {
    business_id: formData.get("business_id"),
    service_id: formData.get("service_id"),
    starts_at: formData.get("starts_at"),
    customer_name: String(formData.get("customer_name") ?? "").trim(),
    customer_phone: String(formData.get("customer_phone") ?? "").trim(),
    customer_email: String(formData.get("customer_email") ?? "").trim(),
    pet_name: String(formData.get("pet_name") ?? "").trim(),
    pet_species: String(formData.get("pet_species") ?? "dog").trim(),
    pet_breed: String(formData.get("pet_breed") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
  };

  const parsed = BookingSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join(".")] = issue.message;
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }
  const data = parsed.data;
  const supabase = await createClient();

  // Look up service for duration
  const { data: service } = await supabase
    .from("services")
    .select("id, duration_min, business_id")
    .eq("id", data.service_id)
    .eq("business_id", data.business_id)
    .single();
  if (!service) return { ok: false, error: "Service not found." };

  const startsAt = new Date(data.starts_at);
  const endsAt = addMinutes(startsAt, service.duration_min);

  // Find or create customer (unique on business_id + phone)
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("business_id", data.business_id)
    .eq("phone", data.customer_phone)
    .maybeSingle();

  let customerId = existingCustomer?.id;
  if (!customerId) {
    const { data: newCust, error: custErr } = await supabase
      .from("customers")
      .insert({
        business_id: data.business_id,
        name: data.customer_name,
        phone: data.customer_phone,
        email: data.customer_email || null,
      })
      .select("id")
      .single();
    if (custErr || !newCust) return { ok: false, error: custErr?.message ?? "Could not create customer." };
    customerId = newCust.id;
  }

  // Create or reuse pet (match by name within customer)
  const { data: existingPet } = await supabase
    .from("pets")
    .select("id")
    .eq("customer_id", customerId)
    .ilike("name", data.pet_name)
    .maybeSingle();

  let petId = existingPet?.id;
  if (!petId) {
    const { data: newPet } = await supabase
      .from("pets")
      .insert({
        customer_id: customerId,
        name: data.pet_name,
        species: data.pet_species || "dog",
        breed: data.pet_breed || null,
      })
      .select("id")
      .single();
    petId = newPet?.id;
  }

  // Create booking
  const { data: booking, error: bookErr } = await supabase
    .from("bookings")
    .insert({
      business_id: data.business_id,
      customer_id: customerId,
      pet_id: petId,
      service_id: service.id,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "pending",
      notes: data.notes || null,
    })
    .select("id, business_id")
    .single();

  if (bookErr || !booking) return { ok: false, error: bookErr?.message ?? "Could not create booking." };

  // Look up slug to redirect to confirmation
  const { data: biz } = await supabase
    .from("businesses")
    .select("slug")
    .eq("id", booking.business_id)
    .single();

  redirect(`/${biz?.slug}/book/confirmed?b=${booking.id}`);
}
