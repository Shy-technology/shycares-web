import { redirect } from "next/navigation";
import { format } from "date-fns";
import { PawPrint, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function CustomersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("owner_id", user.id)
    .single();
  if (!business) redirect("/onboarding");

  const { data: customers } = await supabase
    .from("customers")
    .select(
      `id, name, phone, email, notes, created_at,
       pets:pets(id, name, breed, species),
       bookings:bookings(id, starts_at, status)`
    )
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  return (
    <div className="px-5 md:px-10 py-6 md:py-10 max-w-6xl">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Customers</h1>
          <p className="text-ink-soft mt-1">
            {customers?.length ?? 0} customer{(customers?.length ?? 0) === 1 ? "" : "s"} so far
          </p>
        </div>
      </header>

      <div className="mt-6 space-y-3">
        {(!customers || customers.length === 0) && (
          <div className="card text-center p-10">
            <PawPrint className="h-10 w-10 text-ink-muted mx-auto" />
            <p className="font-display text-xl mt-3">No customers yet</p>
            <p className="text-sm text-ink-soft mt-1 max-w-sm mx-auto">
              Customers will show up here automatically when they book through your page.
            </p>
          </div>
        )}
        {customers?.map((c: any) => {
          const lastBooking = c.bookings?.length
            ? c.bookings.sort((a: any, b: any) => +new Date(b.starts_at) - +new Date(a.starts_at))[0]
            : null;
          return (
            <div key={c.id} className="card flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h3 className="font-display text-lg">{c.name}</h3>
                <a
                  href={`tel:${c.phone}`}
                  className="text-sm text-ink-soft inline-flex items-center gap-1 mt-1 hover:text-ink"
                >
                  <Phone className="h-3.5 w-3.5" /> {c.phone}
                </a>
                {c.pets?.length > 0 && (
                  <div className="mt-2 flex gap-1.5 flex-wrap">
                    {c.pets.map((p: any) => (
                      <span key={p.id} className="chip">
                        <PawPrint className="h-3 w-3" />
                        {p.name}{p.breed && ` · ${p.breed}`}
                      </span>
                    ))}
                  </div>
                )}
                {c.notes && (
                  <p className="text-xs text-ink-muted mt-2 max-w-md">&ldquo;{c.notes}&rdquo;</p>
                )}
              </div>
              <div className="text-right text-xs text-ink-muted">
                <p>Joined {format(new Date(c.created_at), "d MMM yyyy")}</p>
                {lastBooking && (
                  <p className="mt-1">
                    Last booking: {format(new Date(lastBooking.starts_at), "d MMM")} ({lastBooking.status})
                  </p>
                )}
                <p className="mt-1">{c.bookings?.length ?? 0} total bookings</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
