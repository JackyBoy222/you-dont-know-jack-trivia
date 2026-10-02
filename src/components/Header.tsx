import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-cream/10 bg-ink/90 text-cream backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3 font-display text-lg font-black uppercase leading-none tracking-[-.05em]">
          <Image
            src="/ydkj-logo.png"
            alt=""
            width={42}
            height={42}
            className="size-10 rounded-xl border border-cyan/50 object-cover shadow-[3px_3px_0_#f04b9b]"
          />
          <span className="text-cream">You Don&apos;t Know Jack</span>
        </Link>
        <details className="relative md:hidden">
          <summary
            className="arcade-button flex size-12 cursor-pointer list-none items-center justify-center"
            aria-label="Open menu"
          >
            <Menu />
          </summary>
          <nav className="absolute right-0 mt-3 grid w-60 gap-1 rounded-2xl border-2 border-cyan/60 bg-ink p-2 shadow-[0_10px_0_#00c8d7]">
            {mobileLinks.map((link) => (
              <Link className={mobileLinkClass()} key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </details>
        <nav className="hidden items-center gap-2 md:flex">
          {mainLinks.map((link) => (
            <Link className="header-link" key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <Link className="header-booking-cta" href="/book-jack">Book Jack</Link>
        </nav>
      </div>
    </header>
  );
}

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/shows", label: "Play" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/about", label: "About" },
];

const mobileLinks = [
  ...mainLinks,
  { href: "/winners", label: "Hall of Fame" },
  { href: "/book-jack", label: "Book Jack" },
  { href: "/contact", label: "Contact" },
];

function mobileLinkClass() {
  return "rounded-xl px-4 py-3 text-sm font-bold text-cream/75 hover:bg-cyan/15 hover:text-cyan";
}
