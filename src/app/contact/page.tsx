import Link from "next/link";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return <div className="mx-auto max-w-4xl px-4 py-12">
    <p className="eyebrow">Say hello</p><h1 className="mt-2 font-display text-5xl font-black">Questions, compliments, corrections delivered with flair.</h1>
    <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/65">Use this for general questions. If you want Jack at your venue or event, the booking page asks the useful questions up front.</p>
    <div className="mt-10 grid gap-6 md:grid-cols-[1fr_.65fr]">
      <form className="card grid gap-4" aria-label="General contact form"><label>Name<input className="field mt-2" name="name" required /></label><label>Email<input className="field mt-2" name="email" type="email" required /></label><label>Message<textarea className="field mt-2 min-h-36" name="message" required /></label><button className="btn-primary" type="submit">Send it</button><p className="text-xs text-ink/45">Demo form structure—delivery will be connected before launch.</p></form>
      <aside className="card h-fit"><h2 className="font-display text-2xl font-bold">Planning an event?</h2><p className="mt-3 text-ink/60">Skip the small talk and tell us about the room.</p><Link className="btn-secondary mt-5" href="/book-jack">Booking inquiry</Link></aside>
    </div>
  </div>;
}
