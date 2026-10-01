import { CalendarPlus, MapPin } from "lucide-react";
import { ButtonLink, Card, SmallLabel } from "@/components/ui";
import { formatShowDate } from "@/lib/dates";
import type { Event } from "@/types";
import { StatusBadge } from "./StatusBadge";

export function calendarUrl(e: Event) {
  const start = new Date(e.date);
  const end = new Date(start.getTime() + 3.5 * 3600000);
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`You Don't Know Jack Trivia: ${e.theme}`)}&dates=${f(start)}/${f(end)}&location=${encodeURIComponent(`${e.venue}, ${e.address}`)}`;
}

export function EventCard({ event, recap = false }: { event: Event; recap?: boolean }) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <SmallLabel>{formatShowDate(event.date, { weekday: "long", month: "long", day: "numeric" }).replace(",", " ·")}</SmallLabel>
          <h2 className="mt-1 font-display text-2xl font-bold">{event.theme}</h2>
        </div>
        <StatusBadge status={event.status} />
      </div>
      <p className="flex gap-2 text-sm text-ink/70">
        <MapPin className="size-4 shrink-0 text-teal" />
        {event.venue} · 7:00 PM
      </p>
      {event.announcement && (
        <p className="rounded-xl bg-rouge/15 p-3 text-sm">{event.announcement}</p>
      )}
      <div className="mt-auto flex flex-wrap gap-2">
        {recap ? (
          <ButtonLink href={`/past/${event.slug}`}>Read the recap</ButtonLink>
        ) : (
          <>
            <ButtonLink href={`/shows/${event.slug}`}>Show details</ButtonLink>
            <ButtonLink target="_blank" variant="secondary" href={calendarUrl(event)}>
              <CalendarPlus className="size-4" />
              Add to calendar
            </ButtonLink>
          </>
        )}
      </div>
    </Card>
  );
}
