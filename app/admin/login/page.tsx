"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LockKeyhole, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Invalid credentials");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10">
      <div className="ambient-orb left-[-4rem] top-16 h-56 w-56 bg-rose-200/70" />
      <div className="ambient-orb bottom-10 right-[-2rem] h-72 w-72 bg-amber-200/60" />

      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden rounded-[2.25rem] bg-gradient-to-br from-rose-700 via-rose-600 to-amber-400 p-8 text-white shadow-[0_28px_80px_rgba(190,24,93,0.28)] lg:block">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
            <Sparkles className="h-3.5 w-3.5" />
            Welcome Back
          </p>
          <h1 className="mt-6 font-display text-6xl font-semibold leading-none">
            Manage the pageant beautifully.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-white/85">
            Log in to update candidates, encode reactions, and keep the public
            showcase polished and current.
          </p>
        </div>

        <Card className="w-full max-w-xl justify-center rounded-[2.25rem] border-white/70 bg-white/88 px-2 py-2">
          <CardHeader className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-rose-700 transition hover:text-rose-950"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to public page
            </Link>
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-100 to-amber-100 text-rose-700">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <CardTitle className="font-display text-5xl font-semibold text-rose-950">
              Admin Login
            </CardTitle>
            <p className="text-sm leading-6 text-rose-900/70">
              Use your admin credentials to manage the Gandang Nanay lineup.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-5 rounded-2xl border border-white/70 bg-amber-50/70 px-4 py-3 text-sm text-amber-900/80">
              Default: <code>admin / admin123</code> if you have not changed the
              values in <code>.env</code>.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
