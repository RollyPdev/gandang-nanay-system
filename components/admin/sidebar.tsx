"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, LayoutDashboard, LogOut, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/candidates/new", label: "Add Candidate", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <aside className="glass-panel flex h-full w-full max-w-72 flex-col rounded-[2rem] border border-white/70 p-4 lg:w-72">
      <div className="rounded-[1.6rem] bg-gradient-to-br from-rose-600 via-rose-500 to-amber-400 p-5 text-white shadow-[0_20px_50px_rgba(190,24,93,0.28)]">
        <Link href="/admin/dashboard" className="block">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]">
            <Sparkles className="h-3.5 w-3.5" />
            Control Center
          </p>
          <span className="font-display text-3xl font-semibold leading-none">
            Gandang Nanay
          </span>
          <span className="mt-2 flex items-center gap-2 text-sm text-white/85">
            <Crown className="h-4 w-4" />
            Admin dashboard
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 px-1 py-5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <Button
              variant={pathname === href ? "secondary" : "ghost"}
              className={cn(
                "h-11 w-full justify-start gap-3 rounded-2xl px-4 text-left text-rose-800",
                pathname === href
                  ? "bg-white text-rose-950 shadow-[0_14px_34px_rgba(120,53,15,0.12)] hover:bg-white"
                  : "hover:bg-white/60"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="rounded-[1.6rem] border border-white/65 bg-white/55 p-3">
        <Button
          variant="ghost"
          className="h-11 w-full justify-start gap-3 rounded-2xl px-4 text-rose-700 hover:bg-white hover:text-rose-950"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
