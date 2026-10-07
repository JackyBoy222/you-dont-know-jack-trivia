import Link from "next/link";
import { InquiryForm } from "@/components/forms/InquiryForm";

export const metadata = { title: "Book Jack" };

const eventTypes = [
  ["Weekly venue trivia", "A recurring night that gives regulars a reason to come back."],
  ["Private parties", "Birthdays, reunions, and celebrations with questions built for your crowd."],
  ["Corporate events", "A polished team experience without the beige conference-room energy."],
  ["Fundraisers & specials", "A lively format that keeps guests participating, laughing, and giving."],
];

export default function BookJackPage() {
  return <div className="dark-page mx-auto max-w-6xl px-4 py-12">
    <p className="eyebrow">Bring the circus</p><h1 className="mt-2 max-w-4xl font-display text-3xl font-black sm:text-5xl">Bring a little trivia trouble to your next event.</h1>
    <p className="neon-script neon-magenta mt-4 text-4xl sm:text-5xl">Book Jack</p>
    <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/68">You Don&apos;t Know Jack is a hosted entertainment experience: smart questions, fast pacing, big laughs, and a show adapted to your room.</p>
    <Link className="btn-primary mt-6" href="#booking-inquiry">Request availability</Link>
    <div className="mt-10 grid gap-4 md:grid-cols-2">{eventTypes.map(([title, copy]) => <article className="card" key={title}><h2 className="font-display text-2xl font-bold">{title}</h2><p className="mt-3 leading-7 text-ink/60">{copy}</p></article>)}</div>
    <section id="booking-inquiry" className="mt-14 scroll-mt-24 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
      <div><p className="eyebrow">What you get</p><h2 className="mt-2 font-display text-4xl font-black">The whole show, handled.</h2><ul className="mt-5 grid gap-3 text-ink/68"><li>Customizable rounds and themes</li><li>Professional hosting and pacing</li><li>Scoring, materials, and game management</li><li>A format scaled to your venue and crowd</li></ul></div>
      <InquiryForm kind="booking" deliveryAvailable={Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)} />
    </section>
    <section className="card mt-12"><h2 className="font-display text-2xl font-bold">Just have a quick question?</h2><Link className="btn-secondary mt-4" href="/contact">Contact Jack</Link></section>
  </div>;
}
