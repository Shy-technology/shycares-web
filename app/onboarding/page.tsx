import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Already onboarded? Send to dashboard.
  const { data: existing } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (existing) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-cream-50 py-10">
      <div className="mx-auto max-w-2xl px-5">
        <header className="text-center mb-8">
          <h1 className="font-display text-4xl">Let&rsquo;s set up your booking page</h1>
          <p className="text-ink-soft mt-2">
            Takes about 3 minutes. You can edit anything later from your dashboard.
          </p>
        </header>
        <OnboardingForm
          defaultName={
            (user.user_metadata?.full_name as string)?.split(" ")[0]
              ? `${(user.user_metadata?.full_name as string).split(" ")[0]}'s Pet Care`
              : ""
          }
        />
      </div>
    </main>
  );
}
