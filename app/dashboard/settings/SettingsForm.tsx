"use client";

import { useState, useTransition } from "react";
import { Trash2, Plus, Save } from "lucide-react";
import type { Business, Service } from "@/lib/types";
import { updateBusinessDetails, upsertService, deleteService } from "./actions";
import { formatPrice } from "@/lib/utils";

export default function SettingsForm({
  business,
  services,
}: {
  business: Business;
  services: Service[];
}) {
  return (
    <div className="mt-6 space-y-6">
      <BusinessSection business={business} />
      <ServicesSection services={services} />
    </div>
  );
}

function BusinessSection({ business }: { business: Business }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          await updateBusinessDetails(fd);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        })
      }
      className="card space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">Business details</h2>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={business.is_published}
            className="h-4 w-4 rounded text-peach-500 focus:ring-peach-300"
          />
          Published (visible at shycares.in/{business.slug})
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Name</label>
          <input name="name" defaultValue={business.name} className="input" required />
        </div>
        <div>
          <label className="label">Tagline</label>
          <input name="tagline" defaultValue={business.tagline ?? ""} className="input" />
        </div>
      </div>

      <div>
        <label className="label">About your business</label>
        <textarea
          name="description"
          defaultValue={business.description ?? ""}
          rows={4}
          placeholder="Tell pet parents about your style, experience, what makes you special…"
          className="input"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Phone</label>
          <input name="phone" defaultValue={business.phone} className="input" required />
        </div>
        <div>
          <label className="label">WhatsApp</label>
          <input
            name="whatsapp_number"
            defaultValue={business.whatsapp_number}
            className="input"
            required
          />
        </div>
        <div>
          <label className="label">City</label>
          <input name="city" defaultValue={business.city ?? ""} className="input" />
        </div>
        <div>
          <label className="label">Address</label>
          <input name="address" defaultValue={business.address ?? ""} className="input" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="btn-primary">
          <Save className="h-4 w-4 mr-1.5" />
          {pending ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="text-sm text-sage-500">Saved!</span>}
      </div>
    </form>
  );
}

function ServicesSection({ services }: { services: Service[] }) {
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl">Services</h2>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="btn-ghost text-sm"
        >
          <Plus className="h-4 w-4 mr-1" /> Add service
        </button>
      </div>

      <div className="space-y-2">
        {services.length === 0 && !editing && (
          <p className="text-sm text-ink-muted">No services yet. Click &ldquo;Add service&rdquo;.</p>
        )}
        {services.map((s) => (
          <div key={s.id} className="rounded-xl bg-cream-100 p-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-ink-soft">
                {formatPrice(s.price)} · {s.duration_min} min{" "}
                {!s.is_active && <span className="chip ml-1">Hidden</span>}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(s.id)}
                className="btn-ghost text-sm"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete "${s.name}"?`)) {
                     startTransition(async () => {
                       await deleteService(s.id);
                     });
                   }
                }}
                disabled={pending}
                className="btn-ghost text-sm text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {editing && (
          <ServiceEditor
            service={editing === "new" ? null : services.find((s) => s.id === editing) ?? null}
            onClose={() => setEditing(null)}
          />
        )}
      </div>
    </div>
  );
}

function ServiceEditor({ service, onClose }: { service: Service | null; onClose: () => void }) {
  const [pending, startTransition] = useTransition();
  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          await upsertService(fd);
          onClose();
        })
      }
      className="rounded-xl bg-white ring-2 ring-peach-200 p-4 space-y-3"
    >
      {service && <input type="hidden" name="id" value={service.id} />}
      <div>
        <label className="label">Name</label>
        <input name="name" defaultValue={service?.name ?? ""} required className="input" />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea name="description" defaultValue={service?.description ?? ""} rows={2} className="input" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Price (₹)</label>
          <input
            name="price"
            type="number"
            min="0"
            defaultValue={service?.price ?? ""}
            required
            className="input"
          />
        </div>
        <div>
          <label className="label">Duration (min)</label>
          <input
            name="duration_min"
            type="number"
            min="5"
            defaultValue={service?.duration_min ?? 60}
            required
            className="input"
          />
        </div>
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={service?.is_active ?? true}
          className="h-4 w-4 rounded text-peach-500"
        />
        Active (shown on booking page)
      </label>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} className="btn-ghost text-sm">
          Cancel
        </button>
        <button type="submit" disabled={pending} className="btn-primary text-sm">
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
