import Link from "next/link";
import { Menu } from "lucide-react";
import { NavigationButton } from "@/components/ui";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-cream/10 bg-ink/90 text-cream backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3 font-display text-lg font-black uppercase leading-none tracking-[-.05em]">
          <span className="grid size-9 place-items-center rounded-lg border-2 border-cream/70 bg-magenta text-xs text-cream shadow-[3px_3px_0_#00c8d7]">J!</span>
          <span>You Don&apos;t Know <span className="text-magenta">Jack</span></span>
        </Link>
        <details className="relative md:hidden">
          <summary
            className="arcade-button flex size-12 cursor-pointer list-none items-center justify-center"
            aria-label="Open menu"
          >
            <Menu />
          </summary>
          <nav className="absolute right-0 mt-3 grid w-60 gap-1 rounded-2xl border-2 border-cyan/60 bg-ink p-2 shadow-[0_10px_0_#00c8d7]">
            {links.map((link) => (
              <Link className={mobileLinkClass()} key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </details>
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <NavigationButton
              className={desktopLinkClass()}
              key={link.href}
              href={link.href}
            >
              {link.label}
            </NavigationButton>
          ))}
        </nav>
      </div>
    </header>
  );
}

const links = [
  { href: "/", label: "Home" },
  { href: "/shows", label: "Shows" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/winners", label: "Winners" },
  { href: "/book-jack", label: "Book Jack" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function desktopLinkClass() {
  return undefined;
}

function mobileLinkClass() {
  return "rounded-xl px-4 py-3 text-sm font-bold text-cream/75 hover:bg-cyan/15 hover:text-cyan";
}
