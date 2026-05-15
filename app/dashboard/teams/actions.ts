"use server";

import { revalidatePath } from "next/cache";
import { createHash } from "node:crypto";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// PINs are stored hashed (sha256 + per-app salt). We don't want anyone reading
// pin_hash to be able to brute-force; 4-digit space is small (10k) so we add
// a per-business salt.
function hashPin(pin: string, salt: string) {
  return createHash("sha256").update(`${salt}:${pin}`).digest("hex");
}

async function getOwnerBusiness() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: business } = await supabase
    .from("businesses")
    .select("id, slug")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!business) return null;
  return { supabase, business, userId: user.id };
}

const TeamSchema = z.object({
  name: z.string().min(1, "Name required").max(40),
  pin: z.string().regex(/^\d{4}$/, "PIN must be 4 digits"),
  display_color: z.string().optional(),
});

export type ActionState = { ok: boolean; error?: string };

export async function createTeam(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getOwnerBusiness();
  if (!ctx) return { ok: false, error: "Not signed in" };

  const parsed = TeamSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    pin: String(formData.get("pin") ?? "").trim(),
    display_color: String(formData.get("display_color") ?? "#5C9670"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { error } = await ctx.supabase.from("teams").insert({
    business_id: ctx.business.id,
    name: parsed.data.name,
    pin_hash: hashPin(parsed.data.pin, ctx.business.id),
    display_color: parsed.data.display_color ?? "#5C9670",
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/teams");
  return { ok: true };
}

export async function updateTeamPin(teamId: string, newPin: string): Promise<ActionState> {
  if (!/^\d{4}$/.test(newPin)) return { ok: false, error: "PIN must be 4 digits" };
  const ctx = await getOwnerBusiness();
  if (!ctx) return { ok: false, error: "Not signed in" };

  const { error } = await ctx.supabase
    .from("teams")
    .update({ pin_hash: hashPin(newPin, ctx.business.id) })
    .eq("id", teamId)
    .eq("business_id", ctx.business.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/teams");
  return { ok: true };
}

export async function toggleTeamActive(teamId: string, isActive: boolean): Promise<ActionState> {
  const ctx = await getOwnerBusiness();
  if (!ctx) return { ok: false, error: "Not signed in" };
  const { error } = await ctx.supabase
    .from("teams")
    .update({ is_active: isActive })
    .eq("id", teamId)
    .eq("business_id", ctx.business.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/teams");
  return { ok: true };
}

export async function deleteTeam(teamId: string): Promise<ActionState> {
  const ctx = await getOwnerBusiness();
  if (!ctx) return { ok: false, error: "Not signed in" };
  // Refuse delete if team has bookings
  const { count } = await ctx.supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("team_id", teamId);
  if (count && count > 0) {
    return {
      ok: false,
      error: `This team has ${count} booking(s). Deactivate instead of deleting to preserve history.`,
    };
  }
  const { error } = await ctx.supabase
    .from("teams")
    .delete()
    .eq("id", teamId)
    .eq("business_id", ctx.business.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/teams");
  return { ok: true };
}

// --- Team members (display roster, no auth) ---

const MemberSchema = z.object({
  team_id: z.string().uuid(),
  name: z.string().min(1).max(40),
  role: z.enum(["groomer", "helper", "lead"]).default("groomer"),
  phone: z.string().max(20).optional().or(z.literal("")),
});

export async function addTeamMember(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getOwnerBusiness();
  if (!ctx) return { ok: false, error: "Not signed in" };
  const parsed = MemberSchema.safeParse({
    team_id: formData.get("team_id"),
    name: String(formData.get("name") ?? "").trim(),
    role: String(formData.get("role") ?? "groomer"),
    phone: String(formData.get("phone") ?? "").trim(),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  // Verify team belongs to this owner (RLS will also enforce, but explicit is nice)
  const { data: team } = await ctx.supabase
    .from("teams")
    .select("id")
    .eq("id", parsed.data.team_id)
    .eq("business_id", ctx.business.id)
    .maybeSingle();
  if (!team) return { ok: false, error: "Team not found" };

  const { error } = await ctx.supabase.from("team_members").insert({
    team_id: parsed.data.team_id,
    name: parsed.data.name,
    role: parsed.data.role,
    phone: parsed.data.phone || null,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/teams");
  return { ok: true };
}

export async function removeTeamMember(memberId: string): Promise<ActionState> {
  const ctx = await getOwnerBusiness();
  if (!ctx) return { ok: false, error: "Not signed in" };
  // RLS enforces ownership
  const { error } = await ctx.supabase.from("team_members").delete().eq("id", memberId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/teams");
  return { ok: true };
}
