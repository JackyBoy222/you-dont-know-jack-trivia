"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DemoBadge } from "@/components/DemoBadge";
import { participationRanking, teamStatistics } from "@/lib/stats";
import type { Event, Result, Team, TeamStats, Venue } from "@/types";

type Period = "latest" | "season" | "all";
type Mode = "competitive" | "participation";

export function LeaderboardsExplorer({ events, results, teams, venues }: { events: Event[]; results: Result[]; teams: Team[]; venues: Venue[] }) {
  const [period, setPeriod] = useState<Period>("season");
  const [venueId, setVenueId] = useState("all");
  const [mode, setMode] = useState<Mode>("competitive");

  const stats = useMemo(() => {
    const completed = events.filter((event) => event.status === "completed");
    const venueEvents = venueId === "all" ? completed : completed.filter((event) => event.venueId === venueId);
    const periodEvents = period === "latest" ? venueEvents.slice(-1) : venueEvents;
    const eventIds = new Set(periodEvents.map((event) => event.id));
    const filteredResults = period === "all" && venueId === "all"
      ? results.filter((result) => result.published)
      : results.filter((result) => result.published && eventIds.has(result.eventId));
    const calculated = teamStatistics(teams, filteredResults);
    return mode === "competitive" ? calculated : participationRanking(calculated);
  }, [events, mode, period, results, teams, venueId]);

  return (
    <div className="dark-page mx-auto max-w-6xl px-4 py-12">
      <DemoBadge />
      <p className="eyebrow mt-8">Numbers with opinions</p>
      <h1 className="mt-2 font-display text-5xl font-black">Leaderboards</h1>
      <p className="neon-script neon-cyan mt-4 text-4xl sm:text-5xl">High scores, low humility</p>

      <section className="card mt-8 grid gap-5 md:grid-cols-2">
        <fieldset>
          <legend className="text-xs font-black uppercase tracking-[.16em] text-ink/50">Time period</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["latest", "season", "all"] as Period[]).map((value) => <button className={period === value ? "btn-primary" : "btn-secondary"} key={value} onClick={() => setPeriod(value)}>{value === "all" ? "All-time" : value[0].toUpperCase() + value.slice(1)}</button>)}
          </div>
        </fieldset>
        <label className="text-xs font-black uppercase tracking-[.16em] text-ink/50">
          Venue
          <select className="field mt-3" value={venueId} onChange={(event) => setVenueId(event.target.value)}>
            <option value="all">All venues</option>
            {venues.filter((venue) => venue.id !== "private").map((venue) => <option value={venue.id} key={venue.id}>{venue.name}</option>)}
          </select>
        </label>
      </section>

      <div className="mt-5 grid grid-cols-2 rounded-2xl bg-black/25 p-1">
        <button onClick={() => setMode("competitive")} className={`min-h-12 rounded-xl font-bold ${mode === "competitive" ? "bg-cream text-ink" : "text-ink/60"}`}>Competitive score</button>
        <button onClick={() => setMode("participation")} className={`min-h-12 rounded-xl font-bold ${mode === "participation" ? "bg-cream text-ink" : "text-ink/60"}`}>Participation</button>
      </div>
      <p className="mt-4 text-sm text-ink/55">{mode === "competitive" ? "Ranked by average score, then highest score. Attendance alone does not improve rank." : "Ranked by games attended, kept separate from competitive standing."}</p>

      {stats.length ? <LeaderboardTable stats={stats} /> : <div className="card mt-8">No published results match those filters. Even legends need a first game.</div>}
    </div>
  );
}

function LeaderboardTable({ stats }: { stats: TeamStats[] }) {
  return <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
    <table className="w-full min-w-[720px] text-left text-sm">
      <thead className="bg-white/10 text-xs uppercase tracking-wider"><tr><th className="p-4">Rank</th><th className="p-4">Team</th><th className="p-4">Games</th><th className="p-4">Wins</th><th className="p-4">Average</th><th className="p-4">High</th><th className="p-4">Total</th><th className="p-4">JackPot</th></tr></thead>
      <tbody>{stats.map((stat, index) => <tr className="border-t border-white/10" key={stat.teamId}><td className="p-4 font-black text-magenta">{index + 1}</td><th className="p-4"><Link className="hover:text-magenta" href={`/teams/${stat.teamId}`}>{stat.name}</Link></th><td className="p-4">{stat.gamesAttended}</td><td className="p-4">{stat.wins}</td><td className="p-4">{stat.averageScore}</td><td className="p-4">{stat.highestScore}</td><td className="p-4">{stat.totalPoints}</td><td className="p-4">{stat.jackpotWins}</td></tr>)}</tbody>
    </table>
  </div>;
}
