import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  ExternalLink,
  LogOut,
  PawPrint,
  Settings,
  Store,
  Users,
  UsersRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, slug, profile_photo_url")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!business) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-cream-50">
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 w-64 hidden md:flex flex-col bg-white border-r border-ink/5">
        <div className="px-5 py-5 border-b border-ink/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-peach-500 grid place-items-center shadow-warm">
              <PawPrint className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl font-semibold">Shycares</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 text-sm">
          <NavLink href="/dashboard" icon={<CalendarDays className="h-4 w-4" />}>
            Calendar
          </NavLink>
          <NavLink href="/dashboard/teams" icon={<UsersRound className="h-4 w-4" />}>
            Teams
          </NavLink>
          <NavLink href="/dashboard/platforms" icon={<Store className="h-4 w-4" />}>
            Platforms
          </NavLink>
          <NavLink href="/dashboard/customers" icon={<Users className="h-4 w-4" />}>
            Customers
          </NavLink>
          <NavLink href="/dashboard/settings" icon={<Settings className="h-4 w-4" />}>
            Settings
          </NavLink>
        </nav>
        <div className="p-3 border-t border-ink/5 space-y-2">
          <Link
            href={`/${business.slug}`}
            target="_blank"
            className="flex items-center gap-2 rounded-xl bg-cream-100 px-3 py-2 text-sm text-ink-soft hover:bg-cream-200"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="truncate">shycares.in/{business.slug}</span>
          </Link>
          <form action="/logout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-muted hover:bg-cream-100 hover:text-ink"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-ink/5">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-peach-500 grid place-items-center">
              <PawPrint className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg font-semibold">Shycares</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/${business.slug}`}
              target="_blank"
              className="h-9 w-9 grid place-items-center rounded-xl text-ink-soft hover:bg-cream-100"
              aria-label="View public booking page"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
            <form action="/logout" method="post">
              <button
                type="submit"
                className="h-9 w-9 grid place-items-center rounded-xl text-ink-soft hover:bg-cream-100"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="md:ml-64 pb-20 md:pb-0">{children}</main>

      {/* MOBILE BOTTOM TAB BAR */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-ink/5">
        <div className="grid grid-cols-5 h-16">
          <TabLink href="/dashboard" icon={<CalendarDays className="h-5 w-5" />} label="Calendar" />
          <TabLink href="/dashboard/teams" icon={<UsersRound className="h-5 w-5" />} label="Teams" />
          <TabLink href="/dashboard/platforms" icon={<Store className="h-5 w-5" />} label="Platforms" />
          <TabLink href="/dashboard/customers" icon={<Users className="h-5 w-5" />} label="Customers" />
          <TabLink href="/dashboard/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
        </div>
      </nav>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-ink-soft hover:bg-cream-100 hover:text-ink"
    >
      {icon}
      {children}
    </Link>
  );
}

function TabLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-0.5 text-ink-soft active:bg-cream-100"
    >
      {icon}
      <span className="text-[10px] uppercase tracking-wide">{label}</span>
    </Link>
  );
}
