import { Crown, Medal, Trophy } from "lucide-react";
import { getTotalReactions } from "@/lib/utils";
import type { Candidate } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

export type RankingTableProps = {
  candidates: Candidate[];
  className?: string;
};

const topRankIcons = [Crown, Trophy, Medal];

export function RankingTable({ candidates, className }: RankingTableProps) {
  const ranked = [...candidates]
    .map((candidate) => ({
      ...candidate,
      totalReactions: getTotalReactions(candidate),
    }))
    .sort((a, b) => b.totalReactions - a.totalReactions);

  return (
    <section className={cn("section-shell", className)}>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-800">
          Standings
        </p>
        <h3 className="font-display text-4xl font-semibold text-rose-950">
          Leaderboard
        </h3>
        <p className="mt-2 text-sm leading-6 text-rose-900/70">
          Sorted by total encoded reactions, highest to lowest.
        </p>
      </div>

      <div className="space-y-3">
        {ranked.length === 0 ? (
          <div className="rounded-[1.6rem] border border-dashed border-rose-300/70 bg-white/60 px-5 py-10 text-center text-rose-700">
            Rankings will appear once candidates are added.
          </div>
        ) : (
          ranked.map((candidate, index) => {
            const Icon = topRankIcons[index];

            return (
              <div
                key={candidate.id}
                className="glass-panel flex items-center gap-4 rounded-[1.6rem] border border-white/70 px-4 py-4 transition duration-300 hover:-translate-y-0.5"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold shadow-inner",
                    index < 3
                      ? "bg-gradient-to-br from-amber-200 to-orange-100 text-amber-950"
                      : "bg-rose-100/80 text-rose-800"
                  )}
                >
                  {Icon ? <Icon className="h-5 w-5" /> : index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-rose-950">
                    {candidate.name}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700/65">
                    Rank #{index + 1}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-rose-900">
                    {candidate.totalReactions.toLocaleString()}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-rose-700/65">
                    reactions
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
