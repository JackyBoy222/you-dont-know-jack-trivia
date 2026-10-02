import type { Metadata } from "next";
import Link from "next/link";
import { Crown, MapPin, Trophy, Zap } from "lucide-react";
import { notFound } from "next/navigation";
import { DemoBadge } from "@/components/DemoBadge";
import { earnedAchievements } from "@/lib/achievements";
import { scoreTotal } from "@/lib/scoring";
import { getData } from "@/services/data";

type TeamPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getData();
  const team = data.teams.find((item) => item.slug === slug || item.id === slug);
  return team ? { title: team.name, description: `${team.name} trivia results and achievements.` } : { title: "Team not found" };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;
  const data = await getData();
  const team = data.teams.find((item) => item.slug === slug || item.id === slug);
  if (!team) notFound();

  const stat = data.stats.find((item) => item.teamId === team.id)!;
  const teamResults = data.results
    .filter((result) => result.teamId === team.id && result.published)
    .map((result) => ({ result, show: data.events.find((event) => event.id === result.eventId) }))
    .filter((entry) => entry.show)
    .sort((a, b) => b.show!.date.localeCompare(a.show!.date));
  const achievements = earnedAchievements(stat, data.achievements);
  const venueHistory = Object.values(teamResults.reduce<Record<string, { name: string; games: number; wins: number }>>((history, entry) => {
    const venue = entry.show!.venue;
    history[venue] ??= { name: venue, games: 0, wins: 0 };
    history[venue].games += 1;
    if (entry.result.place === 1) history[venue].wins += 1;
    return history;
  }, {})).sort((a, b) => b.games - a.games);

  return (
    <div className="dark-page mx-auto max-w-6xl px-4 py-12">
      <DemoBadge />
      <header className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex size-24 shrink-0 items-center justify-center rounded-3xl border-4 border-magenta bg-gradient-to-br from-rouge to-violet font-display text-4xl font-black shadow-[0_0_24px_rgba(240,75,155,.24)]">{team.name[0]}</div>
        <div><p className="eyebrow">Team profile</p><h1 className="mt-1 font-display text-5xl font-black uppercase leading-[.9] tracking-[-.05em]">{team.name}</h1><p className="mt-3 text-ink/55">{team.players.join(" · ")}</p></div>
      </header>

      <section className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Wins" value={stat.wins} icon={Crown} />
        <Stat label="Games" value={stat.gamesAttended} icon={Trophy} />
        <Stat label="Average" value={stat.averageScore} icon={Zap} />
        <Stat label="High score" value={stat.highestScore} icon={Trophy} />
      </section>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <section>
          <p className="eyebrow">The receipts</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Game history</h2>
          <div className="mt-5 grid gap-3">
            {teamResults.map(({ result, show }) => <article className="card grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center" key={result.eventId}>
              <div><Link className="font-display text-xl font-bold hover:text-magenta" href={`/shows/${show!.slug}`}>{show!.theme}</Link><p className="mt-2 flex items-center gap-2 text-sm text-ink/52"><MapPin className="size-4 text-magenta" />{show!.venue} · Place #{result.place}</p></div>
              <div className="sm:text-right"><p className="venue-number text-2xl text-emerald">{scoreTotal(result)}</p><p className="text-xs text-ink/45">{result.recordedTotal!==undefined?"Final score recorded":`${result.bonusCorrect.filter(Boolean).length}/4 bonuses`}</p></div>
            </article>)}
          </div>
        </section>

        <div className="grid content-start gap-8">
          <section><p className="eyebrow">Where they play</p><h2 className="mt-2 font-display text-3xl font-bold">Venue history</h2><div className="mt-5 grid gap-3">{venueHistory.map((venue) => <div className="card flex items-center justify-between gap-4" key={venue.name}><div><b>{venue.name}</b><p className="text-sm text-ink/48">{venue.games} game{venue.games === 1 ? "" : "s"}</p></div><span className="venue-number text-magenta">{venue.wins}W</span></div>)}</div></section>
          <section><p className="eyebrow">Shiny objects</p><h2 className="mt-2 font-display text-3xl font-bold">Achievements</h2><div className="mt-5 grid gap-3">{achievements.length ? achievements.map((achievement) => <div className="card flex gap-4" key={achievement.id}><span className="text-3xl text-gold">{achievement.icon}</span><div><b>{achievement.name}</b><p className="text-sm text-ink/55">{achievement.description}</p></div></div>) : <div className="card text-ink/55">No badges yet. Infamy takes time.</div>}</div></section>
        </div>
      </div>

      <section className="card mt-9"><h2 className="font-display text-2xl font-bold">JackPot history</h2><p className="mt-2 text-ink/65">{stat.jackpotQualifications} qualification{stat.jackpotQualifications === 1 ? "" : "s"} · {stat.jackpotWins} win{stat.jackpotWins === 1 ? "" : "s"} · {Math.round(stat.bonusesCorrect / (stat.gamesAttended * 4 || 1) * 100)}% bonus accuracy</p></section>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Crown }) {
  return <div className="card"><Icon className="size-5 text-magenta" /><p className="mt-3 text-xs uppercase text-ink/45">{label}</p><p className="font-display text-3xl font-black text-gold">{value}</p></div>;
}
