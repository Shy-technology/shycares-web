"use client";

import { useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { Plus, Trash2, X } from "lucide-react";
import {
  upsertPlatform,
  deletePlatform,
  togglePlatformActive,
  type PlatformState,
} from "./actions";
import type { Platform } from "@/lib/types";

const initial: PlatformState = { ok: false };

export default function PlatformsManager({ platforms }: { platforms: Platform[] }) {
  const [editing, setEditing] = useState<Platform | "new" | null>(
    platforms.length === 0 ? "new" : null
  );

  return (
    <div className="space-y-3">
      {platforms.length === 0 && editing !== "new" && (
        <div className="card text-center p-10">
          <p className="font-display text-xl">No platforms yet</p>
          <p className="text-sm text-ink-soft mt-1">
            Add Mylopaws, Woofly, and any other source you take bookings from.
          </p>
          <button onClick={() => setEditing("new")} className="btn-primary mt-5">
            <Plus className="h-4 w-4 mr-1.5" /> Add platform
          </button>
        </div>
      )}

      {platforms.map((p) => (
        <PlatformRow
          key={p.id}
          platform={p}
          isEditing={editing === p}
          onEdit={() => setEditing(p)}
          onClose={() => setEditing(null)}
        />
      ))}

      {editing === "new" && <PlatformForm onClose={() => setEditing(null)} />}

      {platforms.length > 0 && editing !== "new" && (
        <button onClick={() => setEditing("new")} className="btn-secondary w-full">
          <Plus className="h-4 w-4 mr-1.5" /> Add another platform
        </button>
      )}

      <div className="mt-6 p-4 rounded-xl bg-cream-100 text-sm text-ink-soft">
        <p className="font-medium text-ink mb-1">Quick reference — Vijay&rsquo;s numbers</p>
        <ul className="space-y-0.5 text-xs">
          <li>• <strong>Mylopaws:</strong> 85% (salon: Mylopaws bears shampoo; home: you bear all costs)</li>
          <li>• <strong>Woofly:</strong> 75% (operator bears costs)</li>
          <li>• <strong>Direct / own brand:</strong> 100% (operator bears costs)</li>
        </ul>
      </div>
    </div>
  );
}

function PlatformRow({
  platform,
  isEditing,
  onEdit,
  onClose,
}: {
  platform: Platform;
  isEditing: boolean;
  onEdit: () => void;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();

  if (isEditing) return <PlatformForm existing={platform} onClose={onClose} />;

  return (
    <div className={`card flex flex-wrap items-center justify-between gap-3 ${!platform.is_active ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="h-3 w-3 rounded-full flex-none"
          style={{ background: platform.display_color ?? "#040404" }}
          aria-hidden
        />
        <div className="min-w-0">
          <p className="font-medium truncate">{platform.name}</p>
          <p className="text-xs text-ink-muted">
            {platform.revenue_share_pct}% to you · costs borne by{" "}
            <span className="font-medium text-ink-soft">{platform.costs_borne_by}</span>
            {!platform.is_active && " · inactive"}
          </p>
          {platform.notes && (
            <p className="text-xs text-ink-muted mt-1 italic">&ldquo;{platform.notes}&rdquo;</p>
          )}
        </div>
      </div>
      <div className="flex gap-1">
        <button onClick={onEdit} className="btn-ghost text-xs">
          Edit
        </button>
        <button
          onClick={() =>
            startTransition(() => void togglePlatformActive(platform.id, !platform.is_active))
          }
          disabled={pending}
          className="btn-ghost text-xs"
        >
          {platform.is_active ? "Deactivate" : "Activate"}
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete "${platform.name}"?`)) {
              startTransition(async () => {
                const r = await deletePlatform(platform.id);
                if (!r.ok && r.error) alert(r.error);
              });
            }
          }}
          disabled={pending}
          className="btn-ghost text-xs text-red-600 hover:bg-red-50"
          aria-label="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function PlatformForm({ existing, onClose }: { existing?: Platform; onClose: () => void }) {
  const [state, action] = useFormState(upsertPlatform, initial);
  const [pending, startTransition] = useTransition();

  if (state.ok) {
    onClose();
    return null;
  }

  return (
    <form
      action={(fd) => startTransition(() => action(fd))}
      className="card border-2 border-peach-500/10 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">
          {existing ? "Edit platform" : "New platform"}
        </h2>
        <button type="button" onClick={onClose} className="text-ink-muted hover:text-ink">
          <X className="h-5 w-5" />
        </button>
      </div>

      {existing && <input type="hidden" name="id" value={existing.id} />}

      <div>
        <label className="label">Platform name</label>
        <input
          name="name"
          required
          maxLength={60}
          defaultValue={existing?.name ?? ""}
          placeholder="e.g. Mylopaws"
          className="input"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Your revenue share (%)</label>
          <input
            name="revenue_share_pct"
            type="number"
            required
            min="0"
            max="100"
            step="0.01"
            defaultValue={existing?.revenue_share_pct ?? "85"}
            className="input"
          />
        </div>
        <div>
          <label className="label">Costs borne by</label>
          <select
            name="costs_borne_by"
            defaultValue={existing?.costs_borne_by ?? "operator"}
            className="input"
          >
            <option value="operator">Operator (you)</option>
            <option value="platform">Platform</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Display color</label>
        <input
          name="display_color"
          type="color"
          defaultValue={existing?.display_color ?? "#040404"}
          className="h-10 w-20 rounded-lg border border-ink/10 cursor-pointer"
        />
      </div>

      <div>
        <label className="label">Notes (optional)</label>
        <textarea
          name="notes"
          rows={2}
          maxLength={500}
          defaultValue={existing?.notes ?? ""}
          placeholder="e.g. Salon: platform shampoo. Home: I bear all costs."
          className="input"
        />
      </div>

      {state.error && (
        <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">{state.error}</div>
      )}

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} className="btn-ghost">
          Cancel
        </button>
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
