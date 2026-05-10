import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .single();
  if (!business) redirect("/onboarding");

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", business.id)
    .order("display_order", { ascending: true });

  return (
    <div className="px-5 md:px-10 py-6 md:py-10 max-w-3xl">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Settings</h1>
          <p className="text-ink-soft mt-1">Edit your booking page details</p>
        </div>
        <a
          href={`/${business.slug}`}
          target="_blank"
          className="btn-secondary text-sm"
        >
          <ExternalLink className="h-4 w-4 mr-1.5" /> Preview
        </a>
      </header>

      <SettingsForm business={business} services={services ?? []} />
    </div>
  );
}
