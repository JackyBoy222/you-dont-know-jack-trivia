"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Crown, MapPin, Medal, Zap } from "lucide-react";
import { format } from "date-fns";
import { DemoBadge } from "@/components/DemoBadge";
import { scoreTotal } from "@/lib/scoring";
import type { Award, Event, Result, Team, Venue } from "@/types";

type Props = { events: Event[]; teams: Team[]; results: Result[]; awards: Award[]; venues: Venue[] };

export function WinnersExplorer({ events, teams, results, awards, venues }: Props) {
  const history = useMemo(() => events.filter((event) => event.winnerId).sort((a, b) => b.date.localeCompare(a.date)), [events]);
  const years = [...new Set(history.map((event) => new Date(event.date).getFullYear()))].sort((a, b) => b - a);
  const [venueId, setVenueId] = useState("all");
  const [teamId, setTeamId] = useState("all");
  const [year, setYear] = useState("all");

  const filtered = history.filter((event) =>
    (venueId === "all" || event.venueId === venueId) &&
    (teamId === "all" || event.winnerId === teamId) &&
    (year === "all" || new Date(event.date).getFullYear().toString() === year)
  );
  const winCounts = teams.map((team) => ({ team, wins: history.filter((event) => event.winnerId === team.id).length })).filter((entry) => entry.wins).sort((a, b) => b.wins - a.wins);
  const latest = history[0];
  const latestTeam = teams.find((team) => team.id === latest?.winnerId);

  return <div className="dark-page mx-auto max-w-6xl px-4 py-12">
    <DemoBadge /><p className="eyebrow mt-8">Glory, bragging rights, receipts</p><h1 className="mt-2 font-display text-5xl font-black">The winners&apos; circle</h1><p className="neon-script neon-magenta mt-4 text-4xl sm:text-5xl">Make room for the unbearable</p>

    <div className="mt-10 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
      <section className="card bg-gradient-to-br from-gold/15 to-transparent"><Crown className="size-10 text-gold" /><p className="mt-5 text-sm text-ink/55">Most recent winner</p><Link className="font-display text-3xl font-bold hover:text-magenta" href={`/teams/${latestTeam?.slug ?? ""}`}>{latestTeam?.name ?? "To be crowned"}</Link><p className="mt-2 text-ink/60">{latest?.theme} · {latest?.venue}</p></section>
      <section className="card"><h2 className="font-display text-2xl font-bold">Championship count</h2><div className="mt-4 grid gap-2">{winCounts.map(({ team, wins }) => <Link className="flex justify-between rounded-xl bg-black/20 p-3 hover:bg-magenta/10" href={`/teams/${team.slug}`} key={team.id}><span>{team.name}</span><b className="text-gold">{wins} win{wins === 1 ? "" : "s"}</b></Link>)}</div></section>
    </div>

    <section className="card mt-10 grid gap-4 sm:grid-cols-3">
      <label className="text-xs font-black uppercase tracking-[.16em] text-ink/50">Venue<select className="field mt-2" value={venueId} onChange={(event) => setVenueId(event.target.value)}><option value="all">All venues</option>{venues.filter((venue) => history.some((show) => show.venueId === venue.id)).map((venue) => <option value={venue.id} key={venue.id}>{venue.name}</option>)}</select></label>
      <label className="text-xs font-black uppercase tracking-[.16em] text-ink/50">Team<select className="field mt-2" value={teamId} onChange={(event) => setTeamId(event.target.value)}><option value="all">All teams</option>{winCounts.map(({ team }) => <option value={team.id} key={team.id}>{team.name}</option>)}</select></label>
      <label className="text-xs font-black uppercase tracking-[.16em] text-ink/50">Year<select className="field mt-2" value={year} onChange={(event) => setYear(event.target.value)}><option value="all">All years</option>{years.map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
    </section>

    <section className="mt-10"><div className="flex items-end justify-between gap-3"><div><p className="eyebrow">The archive</p><h2 className="mt-2 font-display text-3xl font-bold">Winner history</h2></div><p className="text-sm text-ink/45">{filtered.length} result{filtered.length === 1 ? "" : "s"}</p></div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{filtered.map((event) => {
        const team = teams.find((item) => item.id === event.winnerId);
        const result = results.find((item) => item.eventId === event.id && item.teamId === event.winnerId);
        return <article className="card" key={event.id}><div className="flex items-start justify-between gap-3"><Medal className="text-magenta" /><span className="text-xs text-ink/45">{format(new Date(event.date), "MMM d, yyyy")}</span></div><Link className="mt-4 block font-display text-2xl font-bold hover:text-magenta" href={`/teams/${team?.slug ?? ""}`}>{team?.name}</Link><Link className="mt-1 block text-sm text-ink/55 hover:text-magenta" href={`/shows/${event.slug}`}>{event.theme}</Link><p className="mt-3 flex gap-2 text-sm text-ink/48"><MapPin className="size-4 text-magenta" />{event.venue}</p>{result && <p className="venue-number mt-4 text-emerald">{scoreTotal(result)} points</p>}</article>;
      })}</div>
      {!filtered.length && <div className="card mt-5">No winners match those filters. Try widening the velvet rope.</div>}
    </section>

    <section className="mt-12"><p className="eyebrow">Special recognition</p><h2 className="mt-2 font-display text-3xl font-bold">JackPot winners & awards</h2><div className="mt-5 flex flex-wrap gap-2">{results.filter((result) => result.jackpotWon).map((result) => <span className="rounded-full bg-gold/15 px-4 py-2 text-gold" key={result.eventId}><Zap className="mr-2 inline size-4" />{teams.find((team) => team.id === result.teamId)?.name} · JackPot Winner</span>)}{awards.map((award) => <span className="rounded-full bg-violet/15 px-4 py-2 text-[#c9bdff]" key={award.id}>{teams.find((team) => team.id === award.teamId)?.name} · {award.name}</span>)}</div></section>
  </div>;
}
