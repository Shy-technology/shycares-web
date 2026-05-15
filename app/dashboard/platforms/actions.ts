"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

async function getOwnerBusiness() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!business) return null;
  return { supabase, business };
}

const PlatformSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name required").max(60),
  revenue_share_pct: z.coerce.number().min(0).max(100),
  costs_borne_by: z.enum(["operator", "platform"]).default("operator"),
  display_color: z.string().optional(),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type PlatformState = { ok: boolean; error?: string };

export async function upsertPlatform(
  _prev: PlatformState,
  formData: FormData
): Promise<PlatformState> {
  const ctx = await getOwnerBusiness();
  if (!ctx) return { ok: false, error: "Not signed in" };

  const parsed = PlatformSchema.safeParse({
    id: formData.get("id") || undefined,
    name: String(formData.get("name") ?? "").trim(),
    revenue_share_pct: formData.get("revenue_share_pct"),
    costs_borne_by: String(formData.get("costs_borne_by") ?? "operator"),
    display_color: String(formData.get("display_color") ?? "#040404"),
    notes: String(formData.get("notes") ?? "").trim(),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const row = {
    business_id: ctx.business.id,
    name: parsed.data.name,
    revenue_share_pct: parsed.data.revenue_share_pct,
    costs_borne_by: parsed.data.costs_borne_by,
    display_color: parsed.data.display_color ?? "#040404",
    notes: parsed.data.notes || null,
  };

  if (parsed.data.id) {
    const { error } = await ctx.supabase
      .from("platforms")
      .update(row)
      .eq("id", parsed.data.id)
      .eq("business_id", ctx.business.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await ctx.supabase.from("platforms").insert(row);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/platforms");
  return { ok: true };
}

export async function deletePlatform(id: string): Promise<PlatformState> {
  const ctx = await getOwnerBusiness();
  if (!ctx) return { ok: false, error: "Not signed in" };

  const { count } = await ctx.supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("platform_id", id);
  if (count && count > 0) {
    return {
      ok: false,
      error: `This platform has ${count} booking(s). Set inactive instead of deleting to preserve history.`,
    };
  }

  const { error } = await ctx.supabase
    .from("platforms")
    .delete()
    .eq("id", id)
    .eq("business_id", ctx.business.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/platforms");
  return { ok: true };
}

export async function togglePlatformActive(id: string, isActive: boolean): Promise<PlatformState> {
  const ctx = await getOwnerBusiness();
  if (!ctx) return { ok: false, error: "Not signed in" };
  const { error } = await ctx.supabase
    .from("platforms")
    .update({ is_active: isActive })
    .eq("id", id)
    .eq("business_id", ctx.business.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/platforms");
  return { ok: true };
}
