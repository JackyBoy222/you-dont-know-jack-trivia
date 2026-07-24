import Link from "next/link";
import { CalendarDays, Crown, MapPin, Mic2, Trophy } from "lucide-react";
import { format } from "date-fns";
import { EventCard } from "@/components/EventCard";
import { DemoBadge } from "@/components/DemoBadge";
import { ArcadeIntro } from "@/components/home/ArcadeIntro";
import { scoreTotal } from "@/lib/scoring";
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
  const quip = data.quips[new Date().getDate() % data.quips.length];
  const latestWinner = data.teams.find((team) => team.id === completed[0]?.winnerId);

  return (
    <>
      <ArcadeIntro />
      <div className="arcade-home">
      <section className="overflow-hidden border-b border-cream/10">
        <div className="mx-auto grid min-h-[76svh] max-w-6xl content-center gap-12 px-4 py-16 lg:grid-cols-[1.16fr_.84fr] lg:items-center">
          <div>
            <DemoBadge />
            <p className="eyebrow mt-8">Live trivia · New Orleans</p>
            <h1 className="mt-4 max-w-4xl font-display text-[clamp(4.2rem,12vw,8.4rem)] font-black uppercase leading-[.75] tracking-[-.085em] text-cream">
              You Don&apos;t<br /><span>Know Jack</span>
            </h1>
            <div className="-mt-3 flex max-w-[42rem] justify-center">
              <span className="neon-script neon-cyan inline-block text-[clamp(7rem,16vw,11rem)]">Trivia</span>
            </div>
            <p className="mt-8 max-w-xl text-lg font-medium leading-8 text-cream/68">A fast, funny game show for smart friends, loud rooms, and gloriously wrong answers.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary" href="/shows"><CalendarDays className="size-5" />Find a show</Link>
              <Link className="btn-secondary" href="/book-jack"><Mic2 className="size-5" />Book Jack</Link>
            </div>
          </div>
          {upcoming[0] && <article className="cabinet-panel dive-laminate scanlines relative p-7 sm:p-9 lg:mt-10">
            <div className="absolute right-5 top-5 flex gap-2" aria-hidden="true">
              <span className="size-3 rounded-full border border-ink bg-magenta" />
              <span className="size-3 rounded-full border border-ink bg-brass" />
              <span className="size-3 rounded-full border border-ink bg-emerald" />
            </div>
            <p className="eyebrow">Your next bad decision</p>
            <h2 className="mt-5 font-display text-4xl font-black uppercase leading-[.92] tracking-[-.05em] sm:text-5xl">{upcoming[0].theme}</h2>
            <div className="mt-7 border-y border-cream/15 py-5">
              <p className="venue-number text-lg">{format(new Date(upcoming[0].date), "EEEE, MMMM d · h:mm a")}</p>
              <p className="mt-3 flex gap-2 text-cream/60"><MapPin className="size-5 shrink-0 text-magenta" />{upcoming[0].venue}</p>
            </div>
            <Link className="btn-primary mt-7" href="/shows">Show details</Link>
          </article>}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-center font-display text-2xl font-black uppercase tracking-[-.03em] text-cream/75">“{quip}”</p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink href="/shows" title="Tonight’s Show" copy="Find out where the trouble is." />
        <QuickLink href="/leaderboards" title="Current Standings" copy="See who has become unbearable." />
        <QuickLink href="/winners" title="Latest Winners" copy="Receipts, glory, and bragging rights." />
        <QuickLink href="/book-jack" title="Hire Jack" copy="Bring the show to your crowd." />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <div><p className="eyebrow">Coming up</p><h2 className="mt-2 font-display text-4xl font-black">Upcoming shows</h2></div>
          <Link className="ticket-link" href="/shows">Full calendar</Link>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-3">{upcoming.slice(0, 3).map((show) => <EventCard event={show} key={show.id} />)}</div>
      </section>

      <section className="border-y border-ink/10 bg-paper/45">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Current leaders</p>
            <h2 className="mt-2 font-display text-4xl font-black">The sharp end</h2>
            <ol className="mt-6 grid gap-3">{data.stats.slice(0, 5).map((stat, index) => <li className="card flex items-center justify-between" key={stat.teamId}><span><b className="mr-3 text-magenta">{index + 1}</b><Link href={`/teams/${stat.teamId}`} className="font-bold hover:text-magenta">{stat.name}</Link></span><span className="venue-number text-emerald">{stat.averageScore}</span></li>)}</ol>
            <Link className="btn-secondary mt-5" href="/leaderboards"><Trophy className="size-5" />All standings</Link>
          </div>
          <div>
            <p className="eyebrow">Latest winners</p>
            <h2 className="mt-2 font-display text-4xl font-black">Currently insufferable</h2>
            <article className="card mt-6 p-6"><Crown className="size-9 text-brass" /><h3 className="mt-4 font-display text-3xl font-bold uppercase tracking-[-.04em]">{latestWinner?.name ?? "To be crowned"}</h3><p className="mt-2 text-ink/60">{completed[0]?.theme} · {completed[0]?.venue}</p><p className="mt-4 text-sm text-ink/50">{data.results.find((result) => result.eventId === completed[0]?.id && result.teamId === latestWinner?.id) ? `${scoreTotal(data.results.find((result) => result.eventId === completed[0]?.id && result.teamId === latestWinner?.id)!)} points` : ""}</p></article>
            <Link className="btn-secondary mt-5" href="/winners">Winner archive</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="card grid gap-6 p-7 md:grid-cols-[1fr_auto] md:items-center">
          <div><p className="eyebrow">Bring trivia to your crowd</p><h2 className="mt-2 font-display text-4xl font-black uppercase leading-[.95] tracking-[-.04em]">Need a room full of people to have a suspiciously good time?</h2><p className="mt-4 max-w-3xl text-ink/65">Weekly venue shows, private parties, corporate events, fundraisers, and special occasions—customized, hosted, and handled.</p></div>
          <Link className="btn-primary" href="/book-jack">Book Jack</Link>
        </div>
      </section>
      </div>
    </>
  );
}

function QuickLink({ href, title, copy }: { href: string; title: string; copy: string }) {
  return <Link href={href} className="interactive-card card block"><h2 className="font-display text-2xl font-bold uppercase tracking-[-.04em]">{title}</h2><p className="mt-2 text-sm leading-6 text-ink/58">{copy}</p></Link>;
}
