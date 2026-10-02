import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About Jacky Boy",
  description: "Meet Jacky Boy, the props guy turned host behind You Don’t Know Jack Trivia.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="eyebrow">Meet Jacky Boy</p>
      <h1 className="mt-2 max-w-4xl font-display text-5xl font-black leading-[.95] tracking-[-.04em] sm:text-7xl">
        Hey, I&apos;m Jacky Boy.
      </h1>
      <p className="neon-script neon-magenta mt-4 text-4xl sm:text-5xl">It&apos;s a show before it&apos;s a quiz.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
        <aside className="card overflow-hidden p-5 lg:sticky lg:top-28">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
            <Image
              src="/jacky-boy-about.jpg"
              alt="Jacky Boy wearing a black crown in front of a Pride flag"
              fill
              sizes="(max-width: 1024px) 90vw, 36vw"
              preload
              className="object-cover object-[center_18%]"
            />
          </div>
          <p className="mt-4 text-center font-display text-lg font-black uppercase tracking-[-.03em] text-cream">Jacky Boy</p>
          <p className="text-center text-sm text-ink/55">Host · Writer · Props guy</p>
        </aside>

        <article className="space-y-7 text-[1.05rem] leading-8 text-ink/75 sm:text-lg">
          <p className="text-xl leading-9 text-cream sm:text-2xl">
            I&apos;m the guy behind You Don&apos;t Know Jack Trivia, which is what happens when a love of useless information, movies, spectacle, and making people laugh gets handed a microphone and absolutely no adult supervision.
          </p>
          <p>The whole thing started pretty innocently. A friend asked me to put together trivia for their food pop-up. Just a fun little extra for the night. Nothing serious. Naturally, I made it serious.</p>
          <p>One game became another, people kept showing up, the questions got weirder, the presentation got bigger, and somewhere along the way this little side project developed lights, prizes, inside jokes, recurring teams, its own personality, and a suspicious amount of underwear-related scoring. It took on a life of its own, and honestly, I&apos;ve just been trying to keep up with it ever since.</p>
          <p>Before trivia started demanding custody of my free time, much of my creative life was spent in film and television, working behind the scenes as a crew member in the props department. Which, in retrospect, explains a lot.</p>
          <p>Props work teaches you to obsess over tiny details nobody else notices, make strange ideas physically exist, solve problems five minutes before they become disasters, and occasionally spend an unreasonable amount of time figuring out what kind of coffee mug a fictional person would own. Turns out, that is also excellent training for hosting trivia.</p>
          <p>I&apos;ve always been a huge movie person, not just “I enjoy movies” huge, but the sort of person who remembers the background character, the weird line reading, the fake product somebody was holding in scene three, and the movie everyone else forgot existed. Film, television, music, pop culture, history, food, ridiculous facts, and the wonderfully useless corners of human knowledge all eventually find their way into the game.</p>
          <p>That&apos;s really the heart of You Don&apos;t Know Jack Trivia. I don&apos;t want trivia to feel like a standardized test in a bar. I want it to feel like an event. A little game show. A little dive bar. A little cabaret. A little “why the hell do I know this?”</p>
          <p>The questions matter, but so does everything happening around them: the team names, the running jokes, the arguments whispered furiously across the table, the moment somebody realizes they somehow know the answer, and the glorious confidence of a team that is completely, spectacularly wrong.</p>
          <p>I write and host the games myself, and I&apos;m constantly tinkering with new rounds, formats, themes, visual nonsense, and ways to make the room feel involved. Some nights you&apos;ll know everything. Some nights you&apos;ll know absolutely nothing. Both can be equally entertaining.</p>
          <p>And that&apos;s kind of the point. You don&apos;t have to be a genius. You just have to know something nobody else at your table knows.</p>
          <p className="text-xl leading-9 text-cream">So that&apos;s me: Jacky Boy. A props guy turned trivia host, still building weird little worlds, only now the audience gets to play along. You Don&apos;t Know Jack Trivia started as a favor for a friend and somehow became its own unruly little universe. Come see what you know.</p>
        </article>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link className="btn-primary" href="/shows">See what&apos;s next</Link>
        <Link className="btn-secondary" href="/book-jack">Book Jack</Link>
      </div>
    </div>
  );
}
