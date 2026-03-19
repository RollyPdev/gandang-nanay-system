import Image from "next/image";
import { Crown, Heart, Sparkles, Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getTotalReactions } from "@/lib/utils";
import type { Candidate } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

export type CandidateCardProps = {
  candidate: Candidate;
  rank?: number;
  showBreakdown?: boolean;
  featured?: boolean;
  className?: string;
};

const REACTION_STYLES = {
  Like: "bg-sky-100 text-sky-800",
  Love: "bg-rose-100 text-rose-800",
  Care: "bg-amber-100 text-amber-800",
  Haha: "bg-yellow-100 text-yellow-800",
  Wow: "bg-violet-100 text-violet-800",
  Sad: "bg-slate-200 text-slate-700",
  Angry: "bg-orange-100 text-orange-800",
} as const;

const REACTION_ICONS = {
  Like: "👍",
  Love: "❤️",
  Care: "🤗",
  Haha: "😆",
  Wow: "😮",
  Sad: "😢",
  Angry: "😡",
} as const;

export function CandidateCard({
  candidate,
  rank,
  showBreakdown = false,
  featured = false,
  className,
}: CandidateCardProps) {
  const total = getTotalReactions(candidate);
  const reactions = [
    { label: "Like", value: candidate.like },
    { label: "Love", value: candidate.love },
    { label: "Care", value: candidate.care },
    { label: "Haha", value: candidate.haha },
    { label: "Wow", value: candidate.wow },
    { label: "Sad", value: candidate.sad },
    { label: "Angry", value: candidate.angry },
  ].filter((reaction) => reaction.value > 0);

  const BadgeIcon =
    rank === 1 ? Crown : rank === 2 ? Sparkles : rank === 3 ? Star : null;

  return (
    <Card
      className={cn(
        "group glass-panel overflow-hidden rounded-[1.9rem] border border-white/70 py-0 transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(120,53,15,0.16)]",
        featured && "lg:first:mt-6 lg:last:mt-6",
        className
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-rose-950/40 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

        {rank != null && (
          <div
            className={cn(
              "absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur",
              rank <= 3
                ? "bg-amber-300/90 text-amber-950"
                : "bg-white/80 text-rose-900"
            )}
          >
            {BadgeIcon ? <BadgeIcon className="h-3.5 w-3.5" /> : null}
            Rank #{rank}
          </div>
        )}

        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-rose-50 to-amber-50">
          <Image
            src={candidate.photoUrl}
            alt={candidate.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-contain p-3 transition duration-500 group-hover:scale-[1.04]"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
            Candidate Showcase
          </p>
          <h3 className="font-display text-3xl font-semibold leading-none drop-shadow-sm">
            {candidate.name}
          </h3>
        </div>
      </div>

      <CardHeader className="pb-1 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700/70">
              Total Reactions
            </p>
            <p className="mt-2 text-3xl font-semibold text-rose-950">
              {total.toLocaleString()}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 text-rose-700 shadow-inner">
            <Heart className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {showBreakdown && reactions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {reactions.map((reaction) => (
              <span
                key={reaction.label}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                  REACTION_STYLES[
                    reaction.label as keyof typeof REACTION_STYLES
                  ]
                )}
              >
                <span aria-hidden="true">
                  {REACTION_ICONS[
                    reaction.label as keyof typeof REACTION_ICONS
                  ]}
                </span>
                <span>{reaction.value}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-rose-900/68">
            Encoded reaction counts from the official Facebook post.
          </p>
        )}
      </CardContent>

      <CardFooter className="border-t border-rose-200/60 bg-gradient-to-r from-white/60 to-amber-50/70 text-xs font-medium uppercase tracking-[0.18em] text-rose-700/80">
        Community voting snapshot
      </CardFooter>
    </Card>
  );
}
