import type { Metadata } from "next";
import Link from "next/link";
import { CalendarPlus, Clock3, MapPin, Trophy } from "lucide-react";
import { formatShowDate } from "@/lib/dates";
import { notFound } from "next/navigation";
import { calendarUrl } from "@/components/EventCard";
import { StatusBadge } from "@/components/StatusBadge";
import { scoreTotal } from "@/lib/scoring";
import { getData } from "@/services/data";

type ShowPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ShowPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getData();
  const show = data.events.find((event) => event.slug === slug);
  return show
    ? { title: show.theme, description: `${show.theme} at ${show.venue}` }
    : { title: "Show not found" };
}

export default async function ShowPage({ params }: ShowPageProps) {
  const { slug } = await params;
  const data = await getData();
  const show = data.events.find((event) => event.slug === slug);
  if (!show) notFound();

  const venue = data.venues.find((item) => item.id === show.venueId);
  const showResults = data.results
    .filter((result) => result.eventId === show.id && result.published)
    .sort((a, b) => a.place - b.place);

  return (
    <div className="dark-page mx-auto max-w-5xl px-4 py-12">
      <Link className="ticket-link" href="/shows">← All shows</Link>
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">You Don&apos;t Know Jack Trivia</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-black uppercase leading-[.9] tracking-[-.05em] sm:text-7xl">
            {show.theme}
          </h1>
        </div>
        <StatusBadge status={show.status} />
      </div>

      <section className="card mt-9 grid gap-6 p-6 sm:grid-cols-3">
        <Detail icon={Clock3} label="When" value={formatShowDate(show.date, "EEEE, MMMM d · h:mm a")} />
        <Detail icon={MapPin} label="Where" value={`${show.venue} · ${show.address}`} />
        <Detail icon={Trophy} label="JackPot" value={`${show.jackpot.toLocaleString()} points`} />
      </section>

      {show.announcement && <p className="mt-7 rounded-2xl border border-magenta/35 bg-magenta/10 p-5 text-lg">{show.announcement}</p>}

      <div className="mt-7 flex flex-wrap gap-3">
        <a className="btn-primary" href={calendarUrl(show)} target="_blank" rel="noreferrer">
          <CalendarPlus className="size-5" />Add to calendar
        </a>
        <Link className="btn-secondary" href="/book-jack">Bring this energy to your event</Link>
      </div>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <article className="card">
          <p className="eyebrow">The room</p>
          <h2 className="mt-2 font-display text-3xl font-bold">{venue?.name ?? show.venue}</h2>
          <p className="mt-3 leading-7 text-ink/65">{venue?.description ?? "Show details and venue notes will appear here."}</p>
          <p className="mt-4 text-sm text-ink/55">{show.address}</p>
        </article>
        <article className="card">
          <p className="eyebrow">{show.status === "completed" ? "Final results" : "What to expect"}</p>
          {showResults.length ? (
            <ol className="mt-4 grid gap-3">
              {showResults.map((result) => {
                const team = data.teams.find((item) => item.id === result.teamId);
                return <li className="flex items-center justify-between gap-3" key={result.teamId}>
                  <Link className="font-bold hover:text-magenta" href={`/teams/${team?.slug ?? result.teamId}`}>{result.place}. {team?.name ?? "Unknown team"}</Link>
                  <span className="venue-number">{scoreTotal(result)}</span>
                </li>;
              })}
            </ol>
          ) : (
            <p className="mt-3 leading-7 text-ink/65">Four rounds, fast pacing, strange prizes, and at least one answer your team will defend far too passionately.</p>
          )}
        </article>
      </section>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return <div><Icon className="size-5 text-magenta" /><p className="mt-3 text-xs font-black uppercase tracking-[.16em] text-ink/45">{label}</p><p className="mt-1 font-bold leading-6">{value}</p></div>;
}
