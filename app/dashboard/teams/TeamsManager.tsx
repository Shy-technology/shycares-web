"use client";

import { useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { Plus, RefreshCw, Trash2, User, UserPlus, X } from "lucide-react";
import {
  createTeam,
  updateTeamPin,
  toggleTeamActive,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
  generateRandomPin,
  type ActionState,
} from "./actions";
import type { Team, TeamMember } from "@/lib/types";

type TeamWithMembers = Team & { members: TeamMember[] };

const initial: ActionState = { ok: false };

export default function TeamsManager({
  teams,
  businessSlug,
}: {
  teams: TeamWithMembers[];
  businessSlug: string;
}) {
  const [showCreate, setShowCreate] = useState(teams.length === 0);

  return (
    <div className="space-y-4">
      {teams.length === 0 && !showCreate && (
        <div className="card text-center p-10">
          <p className="font-display text-xl">No teams yet</p>
          <p className="text-sm text-ink-soft mt-1">
            Create your first team to start assigning bookings.
          </p>
          <button onClick={() => setShowCreate(true)} className="btn-primary mt-5">
            <Plus className="h-4 w-4 mr-1.5" /> Create team
          </button>
        </div>
      )}

      {teams.map((t) => (
        <TeamCard key={t.id} team={t} businessSlug={businessSlug} />
      ))}

      {showCreate ? (
        <CreateTeamForm onDone={() => setShowCreate(false)} />
      ) : teams.length > 0 ? (
        <button onClick={() => setShowCreate(true)} className="btn-secondary w-full">
          <Plus className="h-4 w-4 mr-1.5" /> Add another team
        </button>
      ) : null}
    </div>
  );
}

function CreateTeamForm({ onDone }: { onDone: () => void }) {
  const [state, action] = useFormState(createTeam, initial);
  const [pending, startTransition] = useTransition();
  const [pin, setPin] = useState(() => clientRandomPin());

  // After successful create, the page revalidates server-side and onDone closes the form
  if (state.ok) {
    onDone();
    return null;
  }

  return (
    <form
      action={(fd) => startTransition(() => action(fd))}
      className="card border-2 border-peach-500/10 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">New team</h2>
        <button type="button" onClick={onDone} className="text-ink-muted hover:text-ink">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div>
        <label className="label">Team name</label>
        <input
          name="name"
          required
          maxLength={40}
          placeholder="e.g. Team Andheri"
          className="input"
        />
      </div>

      <div>
        <label className="label">4-digit PIN</label>
        <div className="flex gap-2">
          <input
            name="pin"
            required
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            inputMode="numeric"
            pattern="\d{4}"
            className="input font-mono text-lg tracking-widest"
          />
          <button
            type="button"
            onClick={() => setPin(clientRandomPin())}
            className="btn-secondary text-sm"
            aria-label="Generate new PIN"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-ink-muted mt-1">
          Share this with the team. They&rsquo;ll enter it on their phone to log in.
        </p>
      </div>

      {state.error && (
        <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">{state.error}</div>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Creating…" : "Create team"}
      </button>
    </form>
  );
}

function TeamCard({ team, businessSlug }: { team: TeamWithMembers; businessSlug: string }) {
  const [showAddMember, setShowAddMember] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [pending, startTransition] = useTransition();
  const loginUrl = `/t/${team.id}`;

  return (
    <div className={`card ${!team.is_active ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: team.display_color ?? "#5C9670" }}
              aria-hidden
            />
            <h3 className="font-display text-xl">{team.name}</h3>
            {!team.is_active && <span className="chip text-ink-muted">Inactive</span>}
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Login URL: <code className="bg-cream-100 px-1.5 py-0.5 rounded">{loginUrl}</code>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowPin(true)}
            className="btn-ghost text-xs"
            title="Change PIN"
          >
            Change PIN
          </button>
          <button
            onClick={() => startTransition(() => void toggleTeamActive(team.id, !team.is_active))}
            disabled={pending}
            className="btn-ghost text-xs"
          >
            {team.is_active ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${team.name}"?`)) {
                startTransition(async () => {
                  const r = await deleteTeam(team.id);
                  if (!r.ok && r.error) alert(r.error);
                });
              }
            }}
            disabled={pending}
            className="btn-ghost text-xs text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Members */}
      <div className="mt-4 border-t border-ink/5 pt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs uppercase tracking-wide text-ink-muted">Members</p>
          <button
            onClick={() => setShowAddMember(true)}
            className="text-xs text-ink-soft hover:text-ink inline-flex items-center gap-1"
          >
            <UserPlus className="h-3.5 w-3.5" /> Add member
          </button>
        </div>
        {team.members.length === 0 && !showAddMember && (
          <p className="text-sm text-ink-muted">No members added yet.</p>
        )}
        <div className="space-y-1.5">
          {team.members.map((m) => (
            <MemberRow key={m.id} member={m} />
          ))}
        </div>
        {showAddMember && (
          <AddMemberForm teamId={team.id} onDone={() => setShowAddMember(false)} />
        )}
      </div>

      {showPin && <ChangePinModal team={team} onClose={() => setShowPin(false)} />}
    </div>
  );
}

function MemberRow({ member }: { member: TeamMember }) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex items-center justify-between rounded-lg bg-cream-100 px-3 py-2">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-ink-muted" />
        <span className="font-medium">{member.name}</span>
        <span className="chip text-[10px] uppercase">{member.role}</span>
        {member.phone && <span className="text-xs text-ink-muted">· {member.phone}</span>}
      </div>
      <button
        onClick={() => {
          if (confirm(`Remove ${member.name}?`)) {
            startTransition(() => void removeTeamMember(member.id));
          }
        }}
        disabled={pending}
        className="text-ink-muted hover:text-red-600"
        aria-label={`Remove ${member.name}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function AddMemberForm({ teamId, onDone }: { teamId: string; onDone: () => void }) {
  const [state, action] = useFormState(addTeamMember, initial);
  const [pending, startTransition] = useTransition();

  if (state.ok) {
    onDone();
    return null;
  }

  return (
    <form
      action={(fd) => startTransition(() => action(fd))}
      className="mt-2 rounded-lg bg-white ring-1 ring-ink/10 p-3 space-y-2"
    >
      <input type="hidden" name="team_id" value={teamId} />
      <div className="grid grid-cols-12 gap-2">
        <input
          name="name"
          required
          placeholder="Name"
          className="input col-span-5 py-2"
        />
        <select name="role" className="input col-span-3 py-2">
          <option value="groomer">Groomer</option>
          <option value="helper">Helper</option>
          <option value="lead">Lead</option>
        </select>
        <input
          name="phone"
          placeholder="Phone (optional)"
          className="input col-span-4 py-2"
        />
      </div>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onDone} className="btn-ghost text-sm">
          Cancel
        </button>
        <button type="submit" disabled={pending} className="btn-primary text-sm">
          {pending ? "Adding…" : "Add"}
        </button>
      </div>
    </form>
  );
}

function ChangePinModal({ team, onClose }: { team: Team; onClose: () => void }) {
  const [pin, setPin] = useState(clientRandomPin());
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit() {
    setError(null);
    startTransition(async () => {
      const r = await updateTeamPin(team.id, pin);
      if (!r.ok) setError(r.error ?? "Failed");
      else onClose();
    });
  }

  return (
    <div className="fixed inset-0 bg-ink/40 grid place-items-center z-50 p-4" onClick={onClose}>
      <div className="card max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-xl">Change PIN for {team.name}</h3>
          <button onClick={onClose} className="text-ink-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
          inputMode="numeric"
          pattern="\d{4}"
          className="input font-mono text-2xl tracking-widest text-center"
        />
        <button
          type="button"
          onClick={() => setPin(clientRandomPin())}
          className="btn-ghost text-xs w-full mt-2"
        >
          <RefreshCw className="h-3 w-3 mr-1" /> Generate random
        </button>
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        <button onClick={submit} disabled={pending} className="btn-primary w-full mt-4">
          {pending ? "Saving…" : "Save new PIN"}
        </button>
      </div>
    </div>
  );
}

// Lightweight client-side PIN suggester (server has its own for actual security)
function clientRandomPin() {
  const banned = new Set(["0000", "1234", "1111", "2222", "0123"]);
  let pin = "";
  do {
    pin = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  } while (banned.has(pin));
  return pin;
}
