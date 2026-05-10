"use client";

import { useTransition } from "react";
import { CheckCircle2, MessageCircle, XCircle } from "lucide-react";
import { updateBookingStatus } from "./actions";
import type { BookingStatus } from "@/lib/types";

export default function BookingActions({
  bookingId,
  status,
  confirmWhatsappLink,
  reminderWhatsappLink,
}: {
  bookingId: string;
  status: BookingStatus;
  confirmWhatsappLink: string;
  reminderWhatsappLink: string;
}) {
  const [pending, startTransition] = useTransition();

  function handle(next: BookingStatus) {
    startTransition(async () => {
      await updateBookingStatus(bookingId, next);
    });
  }

  return (
    <>
      {status === "pending" && (
        <>
          <a
            href={confirmWhatsappLink}
            target="_blank"
            onClick={() => handle("confirmed")}
            className="btn-primary text-sm"
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Confirm + WhatsApp
          </a>
          <button
            onClick={() => handle("cancelled")}
            disabled={pending}
            className="btn-ghost text-sm text-red-600 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4 mr-1.5" /> Decline
          </button>
        </>
      )}
      {status === "confirmed" && (
        <>
          <a
            href={reminderWhatsappLink}
            target="_blank"
            className="btn-secondary text-sm"
          >
            <MessageCircle className="h-4 w-4 mr-1.5" /> Send reminder
          </a>
          <button
            onClick={() => handle("completed")}
            disabled={pending}
            className="btn-ghost text-sm"
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Mark done
          </button>
          <button
            onClick={() => handle("cancelled")}
            disabled={pending}
            className="btn-ghost text-sm text-red-600 hover:bg-red-50"
          >
            Cancel
          </button>
        </>
      )}
    </>
  );
}
