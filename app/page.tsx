import Link from "next/link";
import { Crown, HeartHandshake, Sparkles, Trophy } from "lucide-react";
import { prisma } from "@/lib/db";
import { getTotalReactions } from "@/lib/utils";
import { CandidateCard } from "@/components/candidate-card";
import { ReactionChart } from "@/components/reaction-chart";
import { RankingTable } from "@/components/ranking-table";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const candidates = await prisma.candidate.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rankedCandidates = [...candidates]
    .map((candidate) => ({
      ...candidate,
      totalReactions: getTotalReactions(candidate),
    }))
    .sort((a, b) => b.totalReactions - a.totalReactions);

  const top3 = rankedCandidates.slice(0, 3);
  const totalReactions = rankedCandidates.reduce(
    (sum, candidate) => sum + candidate.totalReactions,
    0
  );
  const chartData = rankedCandidates.map((candidate) => ({
    name: candidate.name.split(" ")[0] ?? candidate.name,
    total: candidate.totalReactions,
  }));

  const highlights = [
    {
      label: "Candidates",
      value: rankedCandidates.length.toLocaleString(),
      icon: Crown,
    },
    {
      label: "Total Reactions",
      value: totalReactions.toLocaleString(),
      icon: HeartHandshake,
    },
    {
      label: "Leaderboard Ready",
      value: top3.length > 0 ? "Top 3 live" : "Awaiting entries",
      icon: Trophy,
    },
  ];

  return (
    <div className="relative min-h-svh overflow-hidden">
      <div className="ambient-orb -left-20 top-16 h-56 w-56 bg-rose-200/60" />
      <div className="ambient-orb right-0 top-32 h-72 w-72 bg-amber-200/60" />
      <div className="ambient-orb bottom-24 left-1/3 h-48 w-48 bg-orange-100/70" />

      <header className="relative">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-[2rem] border border-white/60 px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-800">
                  <Sparkles className="h-3.5 w-3.5" />
                  Community Pageant Showcase
                </p>
                <h1 className="font-display text-5xl leading-none font-semibold tracking-tight text-rose-950 sm:text-6xl lg:text-7xl">
                  Gandang Nanay
                </h1>
                <p className="mt-3 max-w-xl text-base leading-7 text-rose-900/75 sm:text-lg">
                  Celebrating the candidates of Gandang Nanay Ilawod 2026 of
                  Barangay Sibaguan, Roxas City with a beautiful public showcase
                  of their Facebook reaction standings.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  asChild
                  size="lg"
                  className="h-11 rounded-full bg-rose-600 px-6 text-sm font-semibold shadow-[0_18px_40px_rgba(190,24,93,0.28)] hover:bg-rose-500"
                >
                  <Link href="#leaderboard">View Leaderboard</Link>
                </Button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {highlights.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-[1.75rem] border border-white/70 bg-white/70 p-5 shadow-[0_16px_40px_rgba(120,53,15,0.08)]"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 text-rose-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm uppercase tracking-[0.22em] text-rose-700/70">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-rose-950">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-12 sm:px-6 lg:px-8">
        {top3.length > 0 && (
          <section className="section-shell">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-800">
                  Spotlight
                </p>
                <h2 className="font-display text-4xl font-semibold text-rose-950">
                  Top Candidates
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-rose-900/70">
                The current front-runners based on encoded Facebook reactions.
                Their totals update as new values are entered by the admin team.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {top3.map((candidate, index) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  rank={index + 1}
                  showBreakdown
                  featured
                />
              ))}
            </div>
          </section>
        )}

        <section id="leaderboard" className="section-shell">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-800">
                Full Gallery
              </p>
              <h2 className="font-display text-4xl font-semibold text-rose-950">
                All Candidates
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-rose-900/70">
              Honoring the beauty, strength, and grace of every mother as each
              candidate shines in the Gandang Nanay Ilawod 2026 showcase.
            </p>
          </div>

          {rankedCandidates.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-rose-300/70 bg-white/65 px-6 py-16 text-center">
              <p className="font-display text-3xl font-semibold text-rose-950">
                Candidate lineup coming soon
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-rose-900/70">
                No entries are available yet. Once candidates are added, the
                gallery and ranking board will appear automatically.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {rankedCandidates.map((candidate, index) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  rank={index + 1}
                  showBreakdown
                />
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.35fr]">
          <RankingTable candidates={candidates} />

          <div className="section-shell">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-800">
                  Analytics
                </p>
                <h3 className="font-display text-4xl font-semibold text-rose-950">
                  Reaction Comparison
                </h3>
              </div>
              <p className="max-w-sm text-sm leading-6 text-rose-900/70">
                A quick visual read of how each candidate is performing based on
                total reactions.
              </p>
            </div>

            {chartData.length > 0 ? (
              <ReactionChart data={chartData} />
            ) : (
              <div className="flex h-[360px] items-center justify-center rounded-[1.75rem] border border-dashed border-rose-300/70 bg-white/60 text-rose-700">
                No data to display yet
              </div>
            )}
          </div>
        </section>

        <footer className="pb-6 pt-2 text-center text-sm text-rose-900/65">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mt-1 tracking-[0.22em] uppercase">
            Gandang Nanay Community Pageant
          </p>
        </footer>
      </main>
    </div>
  );
}
