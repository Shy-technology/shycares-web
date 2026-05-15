import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Platform } from "@/lib/types";
import PlatformsManager from "./PlatformsManager";

export default async function PlatformsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!business) redirect("/onboarding");

  const { data: platforms } = await supabase
    .from("platforms")
    .select("*")
    .eq("business_id", business.id)
    .order("display_order", { ascending: true });

  return (
    <div className="px-5 md:px-10 py-6 md:py-10 max-w-3xl">
      <header className="mb-6">
        <h1 className="font-display text-3xl">Platforms</h1>
        <p className="text-ink-soft mt-1">
          Where your bookings come from. Each platform has its own revenue share and cost rules.
        </p>
      </header>
      <PlatformsManager platforms={(platforms ?? []) as Platform[]} />
    </div>
  );
}
