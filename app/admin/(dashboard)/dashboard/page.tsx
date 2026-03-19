import Link from "next/link";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import { HeartHandshake, Pencil, Plus, Trash2, Users } from "lucide-react";
import { prisma } from "@/lib/db";
import { getTotalReactions } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function deleteCandidate(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) return;
  const { prisma } = await import("@/lib/db");
  await prisma.candidate.delete({ where: { id } });
  revalidatePath("/admin/dashboard");
}

export default async function AdminDashboardPage() {
  const candidates = await prisma.candidate.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalReactions = candidates.reduce(
    (sum, candidate) => sum + getTotalReactions(candidate),
    0
  );
  const leader = candidates
    .map((candidate) => ({
      ...candidate,
      totalReactions: getTotalReactions(candidate),
    }))
    .sort((a, b) => b.totalReactions - a.totalReactions)[0];

  return (
    <div className="space-y-6">
      <section className="section-shell">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-800">
              Dashboard
            </p>
            <h1 className="font-display text-5xl font-semibold text-rose-950">
              Manage the showcase
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-rose-900/70">
              Add candidates, update encoded totals, and keep the public page
              presentation fresh and accurate.
            </p>
          </div>

          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/admin/candidates/new" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Candidate
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="rounded-[1.85rem] bg-white/88">
          <CardHeader className="pb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
              <Users className="h-5 w-5" />
            </div>
            <CardTitle className="text-sm uppercase tracking-[0.18em] text-rose-700/70">
              Total Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-rose-950">{candidates.length}</p>
          </CardContent>
        </Card>

        <Card className="rounded-[1.85rem] bg-white/88">
          <CardHeader className="pb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <CardTitle className="text-sm uppercase tracking-[0.18em] text-rose-700/70">
              Total Reactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-rose-950">
              {totalReactions.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[1.85rem] bg-gradient-to-br from-rose-600 via-rose-500 to-amber-400 text-white shadow-[0_22px_60px_rgba(190,24,93,0.22)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-[0.18em] text-white/80">
              Current Leader
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-semibold">
              {leader?.name ?? "No entries yet"}
            </p>
            <p className="mt-2 text-sm text-white/85">
              {leader
                ? `${leader.totalReactions.toLocaleString()} total reactions`
                : "Add candidates to reveal the leader."}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-[2rem] bg-white/88">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="font-display text-4xl font-semibold text-rose-950">
              Candidate Roster
            </CardTitle>
            <p className="text-sm leading-6 text-rose-900/70">
              Edit totals or remove entries directly from the roster below.
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {candidates.length === 0 ? (
            <div className="px-6 py-16 text-center text-rose-700">
              No candidates yet. Add your first candidate to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-white/60 bg-white/55">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-rose-700/70">
                      Photo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-rose-700/70">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-rose-700/70">
                      Total Reactions
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em] text-rose-700/70">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate, index) => (
                    <tr
                      key={candidate.id}
                      className="border-b border-white/50 transition-colors hover:bg-white/55"
                    >
                      <td className="px-6 py-4">
                        <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-gradient-to-b from-rose-50 to-amber-50 ring-1 ring-white/70">
                          <Image
                            src={candidate.photoUrl}
                            alt={candidate.name}
                            fill
                            className="object-contain p-1.5"
                            sizes="56px"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-rose-950">{candidate.name}</p>
                        <p className="text-xs uppercase tracking-[0.16em] text-rose-700/60">
                          Entry #{index + 1}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-rose-800">
                        {getTotalReactions(candidate).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/admin/candidates/${candidate.id}`}
                              className="gap-1.5"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                          </Button>
                          <form action={deleteCandidate}>
                            <input type="hidden" name="id" value={candidate.id} />
                            <Button
                              variant="destructive"
                              size="sm"
                              type="submit"
                              className="gap-1.5"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
