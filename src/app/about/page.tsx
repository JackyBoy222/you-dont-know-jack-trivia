import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "About" };

export default function AboutPage() {
  return <div className="mx-auto max-w-5xl px-4 py-12">
    <p className="eyebrow">Meet Jack</p><h1 className="mt-2 font-display text-5xl font-black">It&apos;s a show before it&apos;s a quiz.</h1>
    <div className="mt-10 grid gap-8 md:grid-cols-[.7fr_1.3fr]"><div className="card flex min-h-72 items-center justify-center overflow-hidden p-5"><Image src="/ydkj-logo.png" alt="You Don’t Know Jack Trivia neon logo" width={1254} height={1254} sizes="(max-width: 768px) 80vw, 32vw" loading="eager" className="h-auto w-full rounded-xl" /></div><div className="space-y-6 text-lg leading-8 text-ink/70"><p>You Don&apos;t Know Jack turns trivia night into a room-wide event: clever without being smug, campy without becoming cheesy, and competitive without forgetting that everyone came to have a good time.</p><p>Built in New Orleans and proudly queer, the show welcomes regulars, first-timers, ringers, guessers, and the friend who swore they knew the answer five seconds too late.</p><p>Jack is building weekly online trivia and hosts booked in-person games for venues, private parties, corporate groups, fundraisers, and special events.</p></div></div>
    <div className="mt-10 flex flex-wrap gap-3"><Link className="btn-primary" href="/shows">Come play</Link><Link className="btn-secondary" href="/book-jack">Book Jack</Link></div>
  </div>;
}
