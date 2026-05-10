"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { RESERVED_SLUGS, slugify } from "@/lib/utils";
import { DEFAULT_HOURS } from "@/lib/types";

const OnboardingSchema = z.object({
  name: z.string().min(2, "Business name is too short").max(80),
  slug: z
    .string()
    .min(3, "URL is too short")
    .max(40)
    .regex(/^[a-z0-9-]+$/, "URL can only contain lowercase letters, numbers and dashes"),
  tagline: z.string().max(120).optional().or(z.literal("")),
  city: z.string().max(60).optional().or(z.literal("")),
  phone: z.string().min(8, "Phone number is required"),
  whatsapp_number: z.string().min(8, "WhatsApp number is required"),
  services: z
    .array(
      z.object({
        name: z.string().min(2),
        price: z.coerce.number().min(0),
        duration_min: z.coerce.number().min(5).max(480),
      })
    )
    .min(1, "Add at least one service"),
});

export type OnboardingFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createBusiness(
  _prev: OnboardingFormState,
  formData: FormData
): Promise<OnboardingFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  // Parse services from form (services[i][name|price|duration_min])
  const serviceCount = Number(formData.get("service_count") ?? 0);
  const services = Array.from({ length: serviceCount }, (_, i) => ({
    name: String(formData.get(`services[${i}][name]`) ?? "").trim(),
    price: formData.get(`services[${i}][price]`),
    duration_min: formData.get(`services[${i}][duration_min]`),
  })).filter((s) => s.name.length > 0);

  const raw = {
    name: String(formData.get("name") ?? "").trim(),
    slug: slugify(String(formData.get("slug") ?? "")),
    tagline: String(formData.get("tagline") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    whatsapp_number: String(formData.get("whatsapp_number") ?? "").trim(),
    services,
  };

  const parsed = OnboardingSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;

  if (RESERVED_SLUGS.has(data.slug)) {
    return {
      ok: false,
      fieldErrors: { slug: "That URL is reserved. Please choose another." },
    };
  }

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from("businesses")
    .select("id")
    .eq("slug", data.slug)
    .maybeSingle();
  if (existing) {
    return {
      ok: false,
      fieldErrors: { slug: "That URL is taken. Please choose another." },
    };
  }

  // Insert business
  const { data: biz, error: bizErr } = await supabase
    .from("businesses")
    .insert({
      owner_id: user.id,
      slug: data.slug,
      name: data.name,
      tagline: data.tagline || null,
      city: data.city || null,
      phone: data.phone,
      whatsapp_number: data.whatsapp_number,
      business_hours: DEFAULT_HOURS,
      is_published: true, // publish immediately so microsite is live
    })
    .select("id")
    .single();

  if (bizErr || !biz) {
    return { ok: false, error: bizErr?.message ?? "Failed to create business." };
  }

  // Insert services
  const serviceRows = data.services.map((s, i) => ({
    business_id: biz.id,
    name: s.name,
    price: s.price,
    duration_min: s.duration_min,
    display_order: i,
  }));
  const { error: svcErr } = await supabase.from("services").insert(serviceRows);
  if (svcErr) {
    return { ok: false, error: svcErr.message };
  }

  redirect("/dashboard?welcome=1");
}

export async function checkSlugAvailability(slug: string) {
  const cleaned = slugify(slug);
  if (!cleaned || cleaned.length < 3) return { available: false, reason: "too_short" };
  if (RESERVED_SLUGS.has(cleaned)) return { available: false, reason: "reserved" };

  const supabase = await createClient();
  const { data } = await supabase
    .from("businesses")
    .select("id")
    .eq("slug", cleaned)
    .maybeSingle();

  return { available: !data, slug: cleaned };
}
