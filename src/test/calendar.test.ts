import { afterEach, describe, expect, it, vi } from "vitest";
import { calendarUrl } from "@/components/EventCard";
import { eventInstant, formatShowDate, nextRegularDates } from "@/lib/dates";
import { events } from "@/data/demo";

afterEach(() => vi.unstubAllEnvs());
describe("New Orleans show times", () => {
  it("interprets legacy wall-clock timestamps in the venue timezone across DST", () => {
    expect(eventInstant("2026-10-07T19:00:00").toISOString()).toBe("2026-10-08T00:00:00.000Z");
    expect(eventInstant("2026-11-04T19:00:00").toISOString()).toBe("2026-11-05T01:00:00.000Z");
  });
  it("preserves timestamps that already have an explicit offset", () => {
    expect(eventInstant("2026-10-07T19:00:00-05:00").toISOString()).toBe("2026-10-08T00:00:00.000Z");
  });
  it.each(["UTC", "America/Los_Angeles"])("generates the same schedule and calendar on a %s server", timezone => {
    vi.stubEnv("TZ", timezone);
    const date = nextRegularDates(new Date("2026-10-06T12:00:00Z"), 1)[0];
    expect(date.toISOString()).toBe("2026-10-08T00:00:00.000Z");
    expect(formatShowDate(date, "EEEE, MMMM d · h:mm a")).toBe("Wednesday, October 7 · 7:00 PM");
    const url = new URL(calendarUrl({ ...events[0], date: "2026-10-07T19:00:00" }));
    expect(url.searchParams.get("dates")).toBe("20261008T000000Z/20261008T033000Z");
  });
});
