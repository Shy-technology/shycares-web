"use client";

import { useMemo, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import {
  addDays,
  addMinutes,
  format,
  isBefore,
  parse,
  startOfDay,
} from "date-fns";
import type { BusinessHours, Service } from "@/lib/types";
import { createBooking, type CreateBookingState } from "./actions";
import { formatPrice } from "@/lib/utils";

const DAYS_AHEAD = 14;
const SLOT_MIN = 30;

const DAY_KEY: (keyof BusinessHours)[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const initialState: CreateBookingState = { ok: false };

export default function BookingForm({
  businessId,
  businessSlug,
  businessHours,
  services,
  preselectedServiceId,
}: {
  businessId: string;
  businessSlug: string;
  businessHours: BusinessHours;
  services: Service[];
  preselectedServiceId: string | null;
}) {
  const [state, formAction] = useFormState(createBooking, initialState);
  const [pending, startTransition] = useTransition();

  const [serviceId, setServiceId] = useState(
    preselectedServiceId ?? services[0]?.id ?? ""
  );
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(startOfDay(new Date()), 1));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const service = services.find((s) => s.id === serviceId);

  // Generate selectable days
  const days = useMemo(
    () => Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(startOfDay(new Date()), i)),
    []
  );

  // Generate slots for the selected date
  const slots = useMemo(() => {
    const dayKey = DAY_KEY[selectedDate.getDay()];
    const hours = businessHours[dayKey];
    if (!hours || hours.closed) return [];
    const open = parse(hours.open, "HH:mm", selectedDate);
    const close = parse(hours.close, "HH:mm", selectedDate);
    const out: Date[] = [];
    let cur = open;
    const minStart = addMinutes(new Date(), 60); // require 1h notice
    while (
      isBefore(addMinutes(cur, service?.duration_min ?? SLOT_MIN), addMinutes(close, 1))
    ) {
      if (isBefore(minStart, cur)) out.push(cur);
      cur = addMinutes(cur, SLOT_MIN);
    }
    return out;
  }, [selectedDate, service, businessHours]);

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form
      action={(fd) => startTransition(() => formAction(fd))}
      className="space-y-5"
    >
      <input type="hidden" name="business_id" value={businessId} />
      <input type="hidden" name="service_id" value={serviceId} />
      <input type="hidden" name="starts_at" value={selectedSlot ?? ""} />

      {/* Service selection */}
      <div className="card">
        <h2 className="font-display text-lg mb-3">1. Pick a service</h2>
        <div className="space-y-2">
          {services.map((s) => (
            <label
              key={s.id}
              className={`flex items-center justify-between gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                serviceId === s.id
                  ? "border-peach-300 bg-peach-50"
                  : "border-ink/10 hover:bg-cream-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={serviceId === s.id}
                  onChange={() => {
                    setServiceId(s.id);
                    setSelectedSlot(null);
                  }}
                  className="h-4 w-4 text-peach-500"
                />
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-ink-muted">{s.duration_min} min</p>
                </div>
              </div>
              <span className="font-display text-peach-500">{formatPrice(s.price)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Date + slot */}
      <div className="card">
        <h2 className="font-display text-lg mb-3">2. Choose a date & time</h2>
        <div className="-mx-2 px-2 flex gap-2 overflow-x-auto pb-2">
          {days.map((d) => {
            const isSelected = format(d, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            const dayHours = businessHours[DAY_KEY[d.getDay()]];
            const closed = !dayHours || dayHours.closed;
            return (
              <button
                key={d.toISOString()}
                type="button"
                disabled={closed}
                onClick={() => {
                  setSelectedDate(d);
                  setSelectedSlot(null);
                }}
                className={`flex-none w-16 rounded-2xl p-3 text-center transition-colors ${
                  isSelected
                    ? "bg-peach-500 text-white shadow-warm"
                    : closed
                    ? "bg-cream-100 text-ink-muted opacity-60"
                    : "bg-white ring-1 ring-ink/5 hover:bg-cream-100"
                }`}
              >
                <div className="text-[11px] uppercase tracking-wide opacity-80">
                  {format(d, "EEE")}
                </div>
                <div className="font-display text-2xl mt-1">{format(d, "d")}</div>
                {closed && <div className="text-[9px] mt-0.5">Closed</div>}
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          {slots.length === 0 ? (
            <p className="text-sm text-ink-muted py-4 text-center">
              No slots available on {format(selectedDate, "EEEE, d MMM")}.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((s) => {
                const iso = s.toISOString();
                const isSelected = selectedSlot === iso;
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => setSelectedSlot(iso)}
                    className={`rounded-xl py-2.5 text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-peach-500 text-white shadow-warm"
                        : "bg-cream-100 text-ink hover:bg-cream-200"
                    }`}
                  >
                    {format(s, "h:mm a")}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Customer & pet info */}
      <div className="card">
        <h2 className="font-display text-lg mb-3">3. Your details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Your name</label>
            <input name="customer_name" required className="input" placeholder="Riya Sharma" />
            {fieldErrors.customer_name && <p className="text-xs text-red-600 mt-1">{fieldErrors.customer_name}</p>}
          </div>
          <div>
            <label className="label">Phone (WhatsApp)</label>
            <input
              name="customer_phone"
              required
              type="tel"
              className="input"
              placeholder="+91 98xxxxxxxx"
            />
            {fieldErrors.customer_phone && <p className="text-xs text-red-600 mt-1">{fieldErrors.customer_phone}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label">Email (optional)</label>
            <input name="customer_email" type="email" className="input" placeholder="[email protected]" />
          </div>
          <div>
            <label className="label">Pet&rsquo;s name</label>
            <input name="pet_name" required className="input" placeholder="Coco" />
          </div>
          <div>
            <label className="label">Breed</label>
            <input name="pet_breed" className="input" placeholder="Indie / Labrador / Persian…" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Notes (optional)</label>
            <textarea
              name="notes"
              rows={2}
              className="input"
              placeholder="Anything we should know? Allergies, anxiety, special requests…"
            />
          </div>
          <input type="hidden" name="pet_species" value="dog" />
        </div>
      </div>

      {state.error && (
        <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">{state.error}</div>
      )}

      <button
        type="submit"
        disabled={pending || !selectedSlot}
        className="btn-primary w-full text-base py-4"
      >
        {pending
          ? "Sending request…"
          : selectedSlot
          ? `Request ${format(new Date(selectedSlot), "EEE, d MMM @ h:mm a")}`
          : "Pick a time slot to continue"}
      </button>
      <p className="text-xs text-ink-muted text-center">
        Your request will be confirmed via WhatsApp by the business.
      </p>
    </form>
  );
}
