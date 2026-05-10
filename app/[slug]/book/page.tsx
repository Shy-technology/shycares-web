import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PawPrint } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RESERVED_SLUGS } from "@/lib/utils";
import BookingForm from "./BookingForm";

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  if (RESERVED_SLUGS.has(slug)) notFound();

  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, slug, business_hours")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!business) notFound();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", business.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (!services || services.length === 0) notFound();

  return (
    <main className="min-h-screen bg-cream-50 pb-20">
      <div className="mx-auto max-w-2xl px-5 py-6">
        <Link href={`/${slug}`} className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to {business.name}
        </Link>

        <div className="mt-6 mb-6 flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-peach-500 grid place-items-center shadow-warm">
            <PawPrint className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl">Book an appointment</h1>
            <p className="text-sm text-ink-soft">{business.name} will confirm via WhatsApp.</p>
          </div>
        </div>

        <BookingForm
          businessId={business.id}
          businessSlug={business.slug}
          businessHours={business.business_hours}
          services={services}
          preselectedServiceId={sp.service ?? null}
        />
      </div>
    </main>
  );
}
