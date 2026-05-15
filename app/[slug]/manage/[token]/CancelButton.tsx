"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { cancelBookingByCustomer } from "./actions";

export default function CancelButton({
  bookingId,
}: {
  bookingId: string;
  businessId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function submit() {
    setError(null);
    startTransition(async () => {
      const r = await cancelBookingByCustomer(bookingId, reason);
      if (!r.ok) {
        setError(r.error ?? "Could not cancel. Please try again.");
        return;
      }
      setOpen(false);
      // Refresh server component data so the "cancelled" banner appears
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-ghost w-full text-red-600 hover:bg-red-50"
      >
        <X className="h-4 w-4 mr-1.5" /> Cancel booking
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-ink/40 grid place-items-center z-50 p-4"
          onClick={() => !pending && setOpen(false)}
        >
          <div
            className="card max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-xl">Cancel this booking?</h3>
              <button
                onClick={() => !pending && setOpen(false)}
                className="text-ink-muted hover:text-ink"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-ink-soft">
              The business will be notified. This can&rsquo;t be undone.
            </p>
            <label className="label mt-4">Reason (optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="e.g. Schedule conflict, pet is unwell…"
              className="input"
            />
            {error && (
              <p className="text-sm text-red-600 mt-2 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="btn-secondary flex-1"
              >
                Keep booking
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={pending}
                className="btn-primary flex-1 bg-red-600 hover:bg-red-500"
              >
                {pending ? "Cancelling…" : "Yes, cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
