import Link from "next/link";
import { Crown, MapPin, Trophy } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { ArcadeIntro } from "@/components/home/ArcadeIntro";
import { NeonHero } from "@/components/home/NeonHero";
import { RotatingQuip } from "@/components/home/RotatingQuip";
import { scoreTotal } from "@/lib/scoring";
import { formatShowDate } from "@/lib/dates";
import type { Event, Result, Team, TeamStats } from "@/types";

type HomeData = {
  events: Event[];
  teams: Team[];
  results: Result[];
  stats: TeamStats[];
  quips: string[];
};

export function HomePage({ data }: { data: HomeData }) {
  const upcoming = data.events.filter((show) => show.status === "upcoming").sort((a, b) => a.date.localeCompare(b.date));
  const completed = data.events.filter((show) => show.status === "completed").sort((a, b) => b.date.localeCompare(a.date));
  const latestWinner = data.teams.find((team) => team.id === completed[0]?.winnerId);

  return (
    <>
      <ArcadeIntro />
      <div className="arcade-home">
      <div className="arcade-reveal-breath" aria-hidden="true" />
      <NeonHero />

      <section className="home-next-section">
        <div className="mx-auto max-w-5xl px-4">
          <p className="home-location-label">Trivia with Jack <span aria-hidden="true">·</span> Online and in person</p>
          <RotatingQuip quips={data.quips} />
          {upcoming[0] && (
            <article className="next-show-panel scanlines">
              <div className="next-show-heading">
                <div>
                  <p className="eyebrow">Your next bad decision</p>
                  <h2 className="mt-3 font-display text-4xl font-black uppercase leading-[.92] tracking-[-.05em] sm:text-6xl">
                    {upcoming[0].theme}
                  </h2>
                </div>
                <div className="next-show-lights" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="next-show-details">
                <div>
                  <p className="next-show-detail-label">When</p>
                  <p className="venue-number mt-2 text-lg sm:text-xl">{formatShowDate(upcoming[0].date, { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" }).replace(" at ", " · ")}</p>
                </div>
                <div>
                  <p className="next-show-detail-label">Where</p>
                  <p className="mt-2 flex gap-2 text-cream/75"><MapPin className="size-5 shrink-0 text-magenta" />{upcoming[0].venue}</p>
                </div>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link className="btn-primary" href={`/shows/${upcoming[0].slug}`}>See show details</Link>
                <Link className="ticket-link" href="/shows">View all shows</Link>
              </div>
            </article>
          )}
          {!upcoming[0] && (
            <article className="next-show-panel scanlines">
              <p className="eyebrow">What&apos;s next</p>
              <h2 className="mt-3 max-w-3xl font-display text-4xl font-black uppercase leading-[.92] tracking-[-.05em] sm:text-6xl">
                Weekly online trivia is in the works.
              </h2>
              <p className="neon-script neon-magenta mt-5 text-3xl sm:text-4xl">A little game show. A little dive bar.</p>
              <p className="mt-5 max-w-2xl text-lg text-cream/70">In-person shows appear here when Jack books a gig. No invented dates, no mystery venues.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link className="btn-primary" href="/contact">Get launch updates</Link>
                <Link className="btn-secondary" href="/book-jack">Book an in-person show</Link>
              </div>
            </article>
          )}
        </div>
      </section>

      {upcoming.length > 0 && <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <div><p className="eyebrow">Coming up</p><h2 className="mt-2 font-display text-4xl font-black">Upcoming shows</h2></div>
          <Link className="ticket-link" href="/shows">Full calendar</Link>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-3">{upcoming.slice(0, 3).map((show) => <EventCard event={show} key={show.id} />)}</div>
      </section>}

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-3">
        <QuickLink href="/past" title="From the archive" copy="Past games, strange themes, and surviving evidence." />
        <QuickLink href="/winners" title="Hall of Fame" copy="Receipts, glory, and bragging rights." />
        <QuickLink href="/book-jack" title="Book a gig" copy="Bring the show to your crowd." />
      </section>

      <section className="home-neon-band border-y border-cream/10">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow">From the archive</p>
            <h2 className="mt-2 font-display text-4xl font-black">Past glory</h2>
            <ol className="mt-6 grid gap-3">{data.stats.slice(0, 5).map((stat, index) => <li className="archive-card flex items-center justify-between" key={stat.teamId}><span><b className="mr-3 text-magenta">{index + 1}</b><Link href={`/teams/${stat.teamId}`} className="font-bold hover:text-magenta">{stat.name}</Link></span><span className="venue-number text-brass">{stat.averageScore}</span></li>)}</ol>
            <Link className="btn-secondary mt-5" href="/leaderboards"><Trophy className="size-5" />All standings</Link>
          </div>
          <div>
            <p className="eyebrow">Latest winners</p>
            <h2 className="mt-2 font-display text-4xl font-black">Currently insufferable</h2>
            <article className="archive-card mt-6 p-6"><Crown className="size-9 text-brass" /><h3 className="mt-4 font-display text-3xl font-bold uppercase tracking-[-.04em]">{latestWinner?.name ?? "To be crowned"}</h3><p className="mt-2 text-ink/60">{completed[0]?.theme} · {completed[0]?.venue}</p><p className="mt-4 text-sm text-ink/50">{data.results.find((result) => result.eventId === completed[0]?.id && result.teamId === latestWinner?.id) ? `${scoreTotal(data.results.find((result) => result.eventId === completed[0]?.id && result.teamId === latestWinner?.id)!)} points` : ""}</p></article>
            <Link className="btn-secondary mt-5" href="/winners">Winner archive</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="card grid gap-6 p-7 md:grid-cols-[1fr_auto] md:items-center">
          <div><p className="eyebrow">Bring trivia to your crowd</p><h2 className="mt-2 font-display text-4xl font-black uppercase leading-[.95] tracking-[-.04em]">Need a room full of people to have a suspiciously good time?</h2><p className="mt-4 max-w-3xl text-ink/65">Venue gigs, private parties, corporate events, fundraisers, and special occasions—customized, hosted, and handled.</p></div>
          <Link className="btn-primary" href="/book-jack">Book Jack</Link>
        </div>
      </section>
      </div>
    </>
  );
}

function QuickLink({ href, title, copy }: { href: string; title: string; copy: string }) {
  return <Link href={href} className="home-editorial-link block"><h2 className="font-display text-2xl font-bold uppercase tracking-[-.04em]">{title}</h2><p className="mt-2 text-sm leading-6 text-ink/58">{copy}</p><span aria-hidden="true" className="mt-5 block text-right text-xl text-brass">→</span></Link>;
}
