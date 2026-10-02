import Link from "next/link";
import Image from "next/image";
import { SHOW } from "@/config/game";

export function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-ink bg-ink px-4 py-10 text-center text-sm text-cream/65">
      <Image
        src="/ydkj-logo.png"
        alt="You Don’t Know Jack Trivia"
        width={112}
        height={112}
        className="mx-auto mb-5 size-28 rounded-2xl object-cover shadow-[0_0_24px_rgba(240,75,155,.2)]"
      />
      <p className="font-display text-lg uppercase tracking-tight text-cream">{SHOW.name}</p>
      <p className="mt-1">Weekly online trivia in the works · In-person gigs by booking</p>
      <nav className="mt-4 flex flex-wrap justify-center gap-4">
        <Link className="hover:text-cyan" href="/shows">Find a show</Link>
        <Link className="hover:text-magenta" href="/book-jack">Book Jack</Link>
        <Link className="hover:text-brass" href="/contact">Contact</Link>
        <Link href="/admin" className="text-cream/35">Host desk</Link>
      </nav>
      <a className="mt-3 inline-block text-cyan hover:underline" href={`https://instagram.com/${SHOW.instagram}`}>
        @{SHOW.instagram}
      </a>
    </footer>
  );
}
