import Link from "next/link";
import { NumericText } from "@/components/ui";
import type { TeamStats } from "@/types";

export function ScoreCards({ stats, limit }: { stats: TeamStats[]; limit?: number }) {
  return (
    <div className="grid gap-3">
      {stats.slice(0, limit).map((s, i) => (
        <Link
          href={`/teams/${s.teamId}`}
          key={s.teamId}
          className="flex items-center gap-4 rounded-lg border border-brass/15 bg-cream/[.045] p-4 transition hover:border-brass/40"
        >
          <NumericText className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brass/15 text-xl text-brass">
            {i + 1}
          </NumericText>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold">{s.name}</p>
            <p className="text-xs text-ink/55">
              {s.wins} wins · {s.gamesAttended} games
            </p>
          </div>
          <div className="text-right">
            <NumericText className="text-xl text-ink">{s.averageScore}</NumericText>
            <p className="text-[10px] uppercase tracking-wider text-ink/45">
              avg score
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
