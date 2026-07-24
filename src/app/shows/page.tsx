import { EventCard } from "@/components/EventCard";
import { DemoBadge } from "@/components/DemoBadge";
import { getData } from "@/services/data";

export const metadata = { title: "Shows" };

export default async function ShowsPage() {
  const data = await getData();
  const upcoming = data.events.filter((show) => ["upcoming", "canceled", "postponed"].includes(show.status)).sort((a, b) => a.date.localeCompare(b.date));
  return <div className="mx-auto max-w-6xl px-4 py-12">
    <DemoBadge /><p className="eyebrow mt-8">Next bad decisions</p><h1 className="mt-2 font-display text-5xl font-black">Shows</h1>
    <p className="mt-3 max-w-2xl text-ink/65">Find the next public game, browse the month, or discover where Jack is causing trouble next.</p>
    {upcoming[0] && <section className="mt-10"><p className="eyebrow">Next show</p><div className="mt-4 max-w-2xl"><EventCard event={upcoming[0]} /></div></section>}
    <section className="mt-12"><h2 className="font-display text-3xl font-bold">Upcoming calendar</h2><div className="mt-5 grid gap-5 md:grid-cols-2">{upcoming.slice(1).map((show) => <EventCard event={show} key={show.id} />)}</div></section>
    <section className="card mt-12"><h2 className="font-display text-2xl font-bold">Want your venue on this list?</h2><p className="mt-2 text-ink/60">Jack is available for recurring trivia nights, private events, and special bookings.</p><a className="btn-primary mt-5" href="/book-jack">Bring Jack to your crowd</a></section>
  </div>;
}
