import Link from "next/link";
import { PawPrint } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center bg-cream-50 px-5">
      <div className="text-center max-w-sm">
        <div className="h-16 w-16 rounded-3xl bg-peach-100 grid place-items-center mx-auto">
          <PawPrint className="h-8 w-8 text-peach-500" />
        </div>
        <h1 className="font-display text-4xl mt-5">Page not found</h1>
        <p className="text-ink-soft mt-2">
          We couldn&rsquo;t find that page. The booking link may be unpublished or the URL might
          have a typo.
        </p>
        <Link href="/" className="btn-primary mt-6">
          Back to Shycares
        </Link>
      </div>
    </main>
  );
}
