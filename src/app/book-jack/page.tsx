import Link from "next/link";

export const metadata = { title: "Book Jack" };

const eventTypes = [
  ["Weekly venue trivia", "A recurring night that gives regulars a reason to come back."],
  ["Private parties", "Birthdays, reunions, and celebrations with questions built for your crowd."],
  ["Corporate events", "A polished team experience without the beige conference-room energy."],
  ["Fundraisers & specials", "A lively format that keeps guests participating, laughing, and giving."],
];

export default function BookJackPage() {
  return <div className="dark-page mx-auto max-w-6xl px-4 py-12">
    <p className="eyebrow">Bring the circus</p><h1 className="mt-2 max-w-4xl font-display text-5xl font-black">Trivia your guests will talk about after they forget the hors d&apos;oeuvres.</h1>
    <p className="neon-script neon-magenta mt-4 text-4xl sm:text-5xl">Book Jack</p>
    <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/68">You Don&apos;t Know Jack is a hosted entertainment experience: smart questions, fast pacing, big laughs, and a show adapted to your room.</p>
    <div className="mt-10 grid gap-4 md:grid-cols-2">{eventTypes.map(([title, copy]) => <article className="card" key={title}><h2 className="font-display text-2xl font-bold">{title}</h2><p className="mt-3 leading-7 text-ink/60">{copy}</p></article>)}</div>
    <section className="mt-14 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
      <div><p className="eyebrow">What you get</p><h2 className="mt-2 font-display text-4xl font-black">The whole show, handled.</h2><ul className="mt-5 grid gap-3 text-ink/68"><li>Customizable rounds and themes</li><li>Professional hosting and pacing</li><li>Scoring, materials, and game management</li><li>A format scaled to your venue and crowd</li></ul></div>
      <form className="card grid gap-4" aria-label="Booking inquiry">
        <h2 className="font-display text-3xl font-bold">Tell Jack about the room</h2>
        <label>Name<input className="field mt-2" name="name" required /></label>
        <label>Email<input className="field mt-2" name="email" type="email" required /></label>
        <label>Organization or venue<input className="field mt-2" name="organization" /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label>Event type<select className="field mt-2" name="eventType" defaultValue="private"><option value="weekly">Weekly venue trivia</option><option value="private">Private party</option><option value="corporate">Corporate event</option><option value="fundraiser">Fundraiser</option><option value="special">Special event</option></select></label><label>Estimated guests<input className="field mt-2" name="guestCount" type="number" min="1" /></label></div>
        <label>What are you planning?<textarea className="field mt-2 min-h-32" name="message" /></label>
        <button className="btn-primary" type="submit">Request availability</button>
        <p className="text-xs text-ink/45">Demo form structure—delivery will be connected before launch.</p>
      </form>
    </section>
    <section className="card mt-12"><h2 className="font-display text-2xl font-bold">Just have a quick question?</h2><Link className="btn-secondary mt-4" href="/contact">Contact Jack</Link></section>
  </div>;
}
