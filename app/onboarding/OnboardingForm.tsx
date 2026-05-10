"use client";

import { useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { Plus, Trash2 } from "lucide-react";
import { createBusiness, type OnboardingFormState } from "./actions";
import { slugify } from "@/lib/utils";

const initialState: OnboardingFormState = { ok: false };

type ServiceRow = { name: string; price: string; duration_min: string };

const STARTER_SERVICES: ServiceRow[] = [
  { name: "Full grooming", price: "1200", duration_min: "90" },
  { name: "Bath & blow dry", price: "600", duration_min: "45" },
  { name: "Nail trim", price: "250", duration_min: "15" },
];

export default function OnboardingForm({ defaultName }: { defaultName: string }) {
  const [state, formAction] = useFormState(createBusiness, initialState);
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState(defaultName);
  const [slug, setSlug] = useState(slugify(defaultName));
  const [services, setServices] = useState<ServiceRow[]>(STARTER_SERVICES);

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form
      action={(fd) => startTransition(() => formAction(fd))}
      className="card space-y-6"
    >
      {/* --- Section 1: Business basics --- */}
      <section>
        <h2 className="font-display text-xl mb-4">About your business</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="label">Business name</label>
            <input
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(slugify(e.target.value));
              }}
              placeholder="e.g. Happy Paws Grooming"
              className="input"
            />
            {fieldErrors.name && <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="slug" className="label">Your booking URL</label>
            <div className="flex items-stretch rounded-xl ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-peach-200 overflow-hidden">
              <span className="bg-cream-100 text-ink-soft px-4 grid place-items-center text-sm">
                shycares.in/
              </span>
              <input
                id="slug"
                name="slug"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="happy-paws"
                className="flex-1 bg-white px-4 py-3 outline-none"
              />
            </div>
            {fieldErrors.slug && <p className="text-xs text-red-600 mt-1">{fieldErrors.slug}</p>}
          </div>

          <div>
            <label htmlFor="tagline" className="label">Tagline (optional)</label>
            <input
              id="tagline"
              name="tagline"
              placeholder="e.g. Stress-free grooming, right at home."
              className="input"
              maxLength={120}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="label">City</label>
              <input id="city" name="city" placeholder="Mumbai" className="input" />
            </div>
            <div>
              <label htmlFor="phone" className="label">Phone (for calls)</label>
              <input
                id="phone"
                name="phone"
                required
                type="tel"
                placeholder="+91 98xxxxxxxx"
                className="input"
              />
              {fieldErrors.phone && <p className="text-xs text-red-600 mt-1">{fieldErrors.phone}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="whatsapp_number" className="label">WhatsApp number</label>
            <input
              id="whatsapp_number"
              name="whatsapp_number"
              required
              type="tel"
              placeholder="+91 98xxxxxxxx"
              className="input"
            />
            <p className="text-xs text-ink-muted mt-1">
              Used for booking confirmations and reminder links. Often the same as phone.
            </p>
            {fieldErrors.whatsapp_number && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.whatsapp_number}</p>
            )}
          </div>
        </div>
      </section>

      {/* --- Section 2: Services --- */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">Your services</h2>
          <button
            type="button"
            onClick={() =>
              setServices((s) => [...s, { name: "", price: "", duration_min: "60" }])
            }
            className="btn-ghost text-sm"
          >
            <Plus className="h-4 w-4 mr-1" /> Add service
          </button>
        </div>

        <input type="hidden" name="service_count" value={services.length} />
        <div className="space-y-3">
          {services.map((s, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-2 items-end rounded-xl bg-cream-100 p-3"
            >
              <div className="col-span-12 sm:col-span-6">
                <label className="label sr-only">Name</label>
                <input
                  name={`services[${i}][name]`}
                  required
                  value={s.name}
                  onChange={(e) =>
                    setServices((arr) =>
                      arr.map((x, j) => (j === i ? { ...x, name: e.target.value } : x))
                    )
                  }
                  placeholder="e.g. Full grooming"
                  className="input"
                />
              </div>
              <div className="col-span-5 sm:col-span-2">
                <label className="label sr-only">Price</label>
                <div className="flex items-stretch rounded-xl ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-peach-200 overflow-hidden bg-white">
                  <span className="px-2 grid place-items-center text-ink-soft text-sm">₹</span>
                  <input
                    name={`services[${i}][price]`}
                    required
                    value={s.price}
                    onChange={(e) =>
                      setServices((arr) =>
                        arr.map((x, j) => (j === i ? { ...x, price: e.target.value } : x))
                      )
                    }
                    placeholder="1200"
                    type="number"
                    min="0"
                    className="flex-1 px-2 py-3 outline-none"
                  />
                </div>
              </div>
              <div className="col-span-5 sm:col-span-3">
                <label className="label sr-only">Duration (min)</label>
                <div className="flex items-stretch rounded-xl ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-peach-200 overflow-hidden bg-white">
                  <input
                    name={`services[${i}][duration_min]`}
                    required
                    value={s.duration_min}
                    onChange={(e) =>
                      setServices((arr) =>
                        arr.map((x, j) =>
                          j === i ? { ...x, duration_min: e.target.value } : x
                        )
                      )
                    }
                    placeholder="60"
                    type="number"
                    min="5"
                    className="flex-1 px-3 py-3 outline-none"
                  />
                  <span className="px-3 grid place-items-center text-ink-soft text-sm">min</span>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 flex justify-end">
                {services.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setServices((arr) => arr.filter((_, j) => j !== i))
                    }
                    className="h-11 w-11 grid place-items-center rounded-xl text-ink-muted hover:bg-white hover:text-red-500 transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {state.error && (
        <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
          {state.error}
        </div>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Setting up your page…" : "Create my booking page →"}
      </button>
      <p className="text-xs text-ink-muted text-center">
        Your microsite goes live the moment you click. You can edit or unpublish anytime.
      </p>
    </form>
  );
}
