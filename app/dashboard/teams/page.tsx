import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TeamsManager from "./TeamsManager";
import type { Team, TeamMember } from "@/lib/types";

type TeamWithMembers = Team & { members: TeamMember[] };

export default async function TeamsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id, slug")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!business) redirect("/onboarding");

  const { data: teamsData } = await supabase
    .from("teams")
    .select("*, members:team_members(*)")
    .eq("business_id", business.id)
    .order("created_at", { ascending: true });

  const teams = (teamsData ?? []) as TeamWithMembers[];

  return (
    <div className="px-5 md:px-10 py-6 md:py-10 max-w-4xl">
      <header className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl">Teams</h1>
          <p className="text-ink-soft mt-1">
            Each team gets a 4-digit PIN to log into their mobile view.
          </p>
        </div>
      </header>
      <TeamsManager teams={teams} businessSlug={business.slug} />
    </div>
  );
}
