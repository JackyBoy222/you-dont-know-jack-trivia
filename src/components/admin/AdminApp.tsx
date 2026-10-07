"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  BarChart3, Building2, CalendarDays, Check, ClipboardList,
  Inbox, LogOut, Pencil, Save, Users,
} from "lucide-react";
import { events as seedEvents, results as seedResults, teams as seedTeams, venues as seedVenues } from "@/data/demo";
import { qualifiesForJackpot, scoreTotal } from "@/lib/scoring";
import { formatShowDate } from "@/lib/dates";
import { teamStatistics } from "@/lib/stats";
import type { Event, EventStatus, Result, ShowType, Team, Venue } from "@/types";

type Tab = "overview" | "shows" | "venues" | "teams" | "scores" | "recaps" | "inquiries";
type Notice = { tone: "success" | "warning"; message: string } | null;
type InquiryStatus = "new" | "contacted" | "qualified" | "booked" | "closed" | "spam";
type DemoInquiry = { id: string; kind: "booking" | "contact"; name: string; email: string; organization?: string; eventType?: string; guestCount?: number; message: string; status: InquiryStatus; createdAt: string };
type HostConsoleState = { shows: Event[]; venues: Venue[]; teams: Team[]; results: Result[]; inquiries: DemoInquiry[] };

const demoInquiries: DemoInquiry[] = [
  { id: "inq-1", kind: "booking", name: "Renee Martin", email: "renee@example.com", organization: "Example Events", eventType: "corporate", guestCount: 75, message: "We need a lively team event for our annual retreat.", status: "new", createdAt: "2026-07-29T15:30:00-05:00" },
  { id: "inq-2", kind: "contact", name: "Chris Bell", email: "chris@example.com", message: "Do teams need to register before Wednesday?", status: "contacted", createdAt: "2026-07-28T11:00:00-05:00" },
];

const nav: Array<[Tab, string, typeof BarChart3]> = [
  ["overview", "Overview", BarChart3],
  ["shows", "Shows", CalendarDays],
  ["venues", "Venues", Building2],
  ["teams", "Teams", Users],
  ["scores", "Scoring", ClipboardList],
  ["recaps", "Recaps", Save],
  ["inquiries", "Inquiries", Inbox],
];

export function AdminApp({ authenticated = false, client, onLogout }: { authenticated?: boolean; client?: SupabaseClient; onLogout?: () => void | Promise<void> }) {
  const [loggedIn, setLoggedIn] = useState(authenticated);
  const [tab, setTab] = useState<Tab>("overview");
  const [shows, setShows] = useState<Event[]>(seedEvents);
  const [venues, setVenues] = useState<Venue[]>(seedVenues);
  const [teams, setTeams] = useState<Team[]>(seedTeams);
  const [results, setResults] = useState<Result[]>(seedResults);
  const [inquiries, setInquiries] = useState<DemoInquiry[]>(authenticated ? [] : demoInquiries);
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(authenticated);
  const [connected, setConnected] = useState(false);
  const hydrated = useRef(false);
  const skipInitialPersist = useRef(true);
  const persistTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!authenticated || !client) return;
    let active = true;
    void client.auth.getSession().then(async ({ data }) => {
      const token = data.session?.access_token;
      if (!token) throw new Error("Your host session expired.");
      const response = await fetch("/api/admin/state", { headers: { authorization: `Bearer ${token}` } });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Unable to load host data.");
      if (!active) return;

      const saved = body.state as Partial<HostConsoleState> | null;
      if (saved) {
        if (Array.isArray(saved.shows)) setShows(saved.shows);
        if (Array.isArray(saved.venues)) setVenues(saved.venues);
        if (Array.isArray(saved.teams)) setTeams(saved.teams);
        if (Array.isArray(saved.results)) setResults(saved.results);
      }
      if (Array.isArray(body.inquiries)) {
        setInquiries(body.inquiries.map((item: Record<string, unknown>) => ({
          id: String(item.id),
          kind: item.kind as "booking" | "contact",
          name: String(item.name),
          email: String(item.email),
          organization: item.organization ? String(item.organization) : undefined,
          eventType: item.event_type ? String(item.event_type) : undefined,
          guestCount: item.guest_count ? Number(item.guest_count) : undefined,
          message: String(item.message),
          status: item.status as InquiryStatus,
          createdAt: String(item.created_at),
        })));
      }
      hydrated.current = true;
      setConnected(true);
      setLoading(false);
    }).catch((error: unknown) => {
      if (!active) return;
      setNotice({ tone: "warning", message: error instanceof Error ? error.message : "Unable to load host data." });
      setLoading(false);
    });
    return () => { active = false; };
  }, [authenticated, client]);

  useEffect(() => {
    if (!authenticated || !client || !hydrated.current || !connected) return;
    if (skipInitialPersist.current) {
      skipInitialPersist.current = false;
      return;
    }
    if (persistTimer.current) window.clearTimeout(persistTimer.current);
    persistTimer.current = window.setTimeout(() => {
      void client.auth.getSession().then(async ({ data }) => {
        const token = data.session?.access_token;
        if (!token) throw new Error("Your host session expired.");
        const state: HostConsoleState = { shows, venues, teams, results, inquiries };
        const response = await fetch("/api/admin/state", {
          method: "PUT",
          headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
          body: JSON.stringify({ state }),
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? "Save failed.");
      }).catch((error: unknown) => {
        setNotice({ tone: "warning", message: error instanceof Error ? error.message : "Save failed." });
      });
    }, 300);
    return () => {
      if (persistTimer.current) window.clearTimeout(persistTimer.current);
    };
  }, [authenticated, client, connected, shows, venues, teams, results, inquiries]);

  if (!loggedIn) return <DevLogin onLogin={() => setLoggedIn(true)} />;
  if (loading) return <div className="dark-page mx-auto max-w-md px-4 py-20"><div className="card"><p className="eyebrow">Secure host access</p><h1 className="mt-2 font-display text-3xl font-black">Loading the control room…</h1></div></div>;

  const saveNotice = (message: string) => {
    setNotice({ tone: "success", message });
    window.setTimeout(() => setNotice(null), 3500);
  };

  return <div className="dark-page min-h-screen">
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="eyebrow">Private host workspace</p><h1 className="mt-1 font-display text-4xl font-black uppercase tracking-[-.04em]">Jack&apos;s control room</h1></div>
        <button className="btn-secondary w-fit" onClick={() => onLogout ? void onLogout() : setLoggedIn(false)}><LogOut className="size-4" />Log out</button>
      </header>

      <div className="mt-6 rounded-xl border border-gold/30 bg-gold/10 p-3 text-sm text-gold">{connected ? <><b>Connected to Supabase:</b> host-console changes now persist after refresh. Bundled starter records remain marked as demo data until replaced with verified show history.</> : <><b>Demo mode:</b> the complete workflow is available for review, but changes reset when you reload or leave this page.</>}</div>
      {notice && <div className="mt-4 rounded-xl border border-emerald/30 bg-emerald/10 p-3 text-sm text-emerald" role="status">{notice.message}</div>}

      <nav className="mt-6 grid grid-cols-2 gap-2 pb-2 sm:flex sm:flex-wrap" aria-label="Host console">
        {nav.map(([id, label, Icon]) => <button key={id} onClick={() => setTab(id)} className={tab === id ? "btn-primary" : "btn-secondary"}><Icon className="size-4" />{label}{id === "inquiries" && inquiries.some((item) => item.status === "new") && <span className="rounded-full bg-magenta px-2 py-0.5 text-xs text-white">{inquiries.filter((item) => item.status === "new").length}</span>}</button>)}
      </nav>

      <main className="mt-6">
        {tab === "overview" && <Overview shows={shows} teams={teams} results={results} inquiries={inquiries} go={setTab} />}
        {tab === "shows" && <ShowManager shows={shows} venues={venues} setShows={setShows} saved={saveNotice} />}
        {tab === "venues" && <VenueManager venues={venues} setVenues={setVenues} saved={saveNotice} />}
        {tab === "teams" && <TeamManager teams={teams} setTeams={setTeams} saved={saveNotice} />}
        {tab === "scores" && <ScoreManager shows={shows} teams={teams} results={results} setResults={setResults} saved={saveNotice} />}
        {tab === "recaps" && <RecapManager shows={shows} setShows={setShows} saved={saveNotice} />}
        {tab === "inquiries" && <InquiryManager inquiries={inquiries} setInquiries={setInquiries} saved={saveNotice} />}
      </main>
    </div>
  </div>;
}

function DevLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = () => password === "lagniappe" ? onLogin() : setError("That password is not invited to this party.");
  return <div className="dark-page mx-auto max-w-md px-4 py-20"><div className="card"><p className="eyebrow">Host access</p><h1 className="mt-2 font-display text-4xl font-black">Control room</h1><p className="mt-3 text-sm text-ink/60">Use the demo password while Supabase Auth is being connected.</p><label className="mt-6 block text-sm font-bold">Password<input className="field mt-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => event.key === "Enter" && login()} /></label>{error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}<button className="btn-primary mt-5 w-full" onClick={login}>Enter host console</button><p className="mt-4 text-xs text-ink/45">Demo password: <code className="text-gold">lagniappe</code></p></div></div>;
}

function Overview({ shows, teams, results, inquiries, go }: { shows: Event[]; teams: Team[]; results: Result[]; inquiries: DemoInquiry[]; go: (tab: Tab) => void }) {
  const stats = teamStatistics(teams, results);
  const nextShow = shows.filter((show) => show.status === "upcoming").sort((a, b) => a.date.localeCompare(b.date))[0];
  const attention = shows.filter((show) => show.status === "upcoming" && (show.theme === "Theme TBA" || !show.announcement)).length;
  return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
    <Metric label="Next show" value={nextShow?.theme ?? "Nothing scheduled"} detail={nextShow?.venue} onClick={() => go("shows")} />
    <Metric label="New inquiries" value={inquiries.filter((item) => item.status === "new").length.toString()} detail="Waiting for a reply" onClick={() => go("inquiries")} />
    <Metric label="Published games" value={new Set(results.filter((result) => result.published).map((result) => result.eventId)).size.toString()} detail={`${teams.length} active teams`} onClick={() => go("scores")} />
    <Metric label="Needs attention" value={attention.toString()} detail="Missing themes or announcements" onClick={() => go("shows")} />
    <section className="card md:col-span-2"><p className="eyebrow">Attendance trend</p><div className="mt-5 flex h-36 items-end gap-4">{shows.filter((show) => show.attendance).slice(-6).map((show) => <div className="flex flex-1 flex-col items-center gap-2" key={show.id}><div className="w-full rounded-t-lg bg-teal" style={{ height: `${Math.max(12, (show.attendance ?? 0) * 2.5)}px` }} /><span className="text-xs">{show.attendance}</span></div>)}</div></section>
    <section className="card md:col-span-2"><p className="eyebrow">Top teams</p>{stats.slice(0, 5).map((stat, index) => <div className="mt-3 flex justify-between gap-3" key={stat.teamId}><span>{index + 1}. {stat.name}</span><b>{stat.averageScore} avg</b></div>)}</section>
  </div>;
}

function Metric({ label, value, detail, onClick }: { label: string; value: string; detail?: string; onClick: () => void }) {
  return <button className="card interactive-card text-left" onClick={onClick}><p className="eyebrow">{label}</p><p className="mt-2 font-display text-3xl font-black">{value}</p><p className="mt-2 text-sm text-ink/50">{detail}</p></button>;
}

function ShowManager({ shows, venues, setShows, saved }: { shows: Event[]; venues: Venue[]; setShows: React.Dispatch<React.SetStateAction<Event[]>>; saved: (message: string) => void }) {
  const [editing, setEditing] = useState<Event | null>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const venue = venues.find((item) => item.id === form.get("venueId")) ?? venues[0];
    const record: Event = {
      id: editing?.id ?? crypto.randomUUID(),
      slug: editing?.slug ?? String(form.get("theme")).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      date: String(form.get("date")),
      theme: String(form.get("theme")),
      venueId: venue.id,
      venue: venue.name,
      address: `${venue.address}, ${venue.city}`,
      showType: String(form.get("showType")) as ShowType,
      status: String(form.get("status")) as EventStatus,
      jackpot: Number(form.get("jackpot")),
      announcement: String(form.get("announcement") ?? ""),
      prizes: String(form.get("prizes") ?? ""),
      attendance: form.get("attendance") ? Number(form.get("attendance")) : undefined,
      isDemo: true,
      roundThemes: editing?.roundThemes ?? [],
      winnerId: editing?.winnerId,
      recap: editing?.recap,
    };
    setShows((items) => editing ? items.map((item) => item.id === editing.id ? record : item) : [...items, record]);
    setEditing(null);
    event.currentTarget.reset();
    saved(editing ? "Show updated." : "Show created.");
  }
  return <div className="grid gap-6 xl:grid-cols-[.75fr_1.25fr]">
    <form className="card grid gap-4" onSubmit={submit} key={editing?.id ?? "new"}>
      <div className="flex items-center justify-between"><h2 className="font-display text-2xl font-bold">{editing ? "Edit show" : "Create a show"}</h2>{editing && <button type="button" className="text-sm text-ink/50" onClick={() => setEditing(null)}>Cancel</button>}</div>
      <label>Theme<input name="theme" className="field mt-1" defaultValue={editing?.theme} required /></label>
      <label>Date & time<input name="date" type="datetime-local" className="field mt-1" defaultValue={editing ? formatShowDate(editing.date, "yyyy-MM-dd'T'HH:mm") : undefined} required /></label>
      <div className="grid gap-4 sm:grid-cols-2"><label>Venue<select name="venueId" className="field mt-1" defaultValue={editing?.venueId}>{venues.filter((venue) => venue.isActive).map((venue) => <option value={venue.id} key={venue.id}>{venue.name}</option>)}</select></label><label>Show type<select name="showType" className="field mt-1" defaultValue={editing?.showType ?? "weekly"}>{["weekly", "private", "corporate", "fundraiser", "special"].map((value) => <option value={value} key={value}>{value}</option>)}</select></label></div>
      <div className="grid gap-4 sm:grid-cols-2"><label>Status<select name="status" className="field mt-1" defaultValue={editing?.status ?? "upcoming"}>{["upcoming", "active", "completed", "canceled", "postponed"].map((value) => <option key={value}>{value}</option>)}</select></label><label>JackPot<input name="jackpot" type="number" min="0" className="field mt-1" defaultValue={editing?.jackpot ?? 1000} /></label></div>
      <label>Announcement<textarea name="announcement" className="field mt-1" defaultValue={editing?.announcement} /></label>
      <div className="grid gap-4 sm:grid-cols-2"><label>Prizes<input name="prizes" className="field mt-1" defaultValue={editing?.prizes} /></label><label>Attendance<input name="attendance" type="number" min="0" className="field mt-1" defaultValue={editing?.attendance} /></label></div>
      <button className="btn-primary"><Save className="size-4" />{editing ? "Save changes" : "Create show"}</button>
    </form>
    <section><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-bold">Show schedule</h2><span className="text-sm text-ink/45">{shows.length} shows</span></div><div className="mt-4 grid gap-3">{[...shows].sort((a, b) => b.date.localeCompare(a.date)).map((show) => <article className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" key={show.id}><div><div className="flex flex-wrap items-center gap-2"><b>{show.theme}</b><span className={`status-${show.status} rounded-full px-2 py-1 text-xs`}>{show.status}</span></div><p className="mt-1 text-sm text-ink/50">{formatShowDate(show.date, "yyyy-MM-dd · h:mm a")} · {show.venue}</p></div><button className="btn-secondary" onClick={() => setEditing(show)}><Pencil className="size-4" />Edit</button></article>)}</div></section>
  </div>;
}

function VenueManager({ venues, setVenues, saved }: { venues: Venue[]; setVenues: React.Dispatch<React.SetStateAction<Venue[]>>; saved: (message: string) => void }) {
  const [editing, setEditing] = useState<Venue | null>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name"));
    const venue: Venue = { id: editing?.id ?? crypto.randomUUID(), slug: editing?.slug ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, address: String(form.get("address")), city: String(form.get("city")), description: String(form.get("description")), bookingUrl: String(form.get("bookingUrl")), isActive: form.get("isActive") === "on", isDemo: true };
    setVenues((items) => editing ? items.map((item) => item.id === editing.id ? venue : item) : [...items, venue]);
    setEditing(null); event.currentTarget.reset(); saved(editing ? "Venue updated." : "Venue added.");
  }
  return <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]"><form className="card grid gap-4" onSubmit={submit} key={editing?.id ?? "new"}><h2 className="font-display text-2xl font-bold">{editing ? "Edit venue" : "Add a venue"}</h2><label>Name<input className="field mt-1" name="name" defaultValue={editing?.name} required /></label><label>Address<input className="field mt-1" name="address" defaultValue={editing?.address} required /></label><label>City<input className="field mt-1" name="city" defaultValue={editing?.city ?? "New Orleans, Louisiana"} required /></label><label>Description<textarea className="field mt-1" name="description" defaultValue={editing?.description} /></label><label>Reservation URL<input className="field mt-1" name="bookingUrl" type="url" defaultValue={editing?.bookingUrl} /></label><label className="flex gap-2"><input name="isActive" type="checkbox" defaultChecked={editing?.isActive ?? true} />Active venue</label><button className="btn-primary"><Save className="size-4" />Save venue</button></form><section className="grid content-start gap-3">{venues.map((venue) => <article className="card flex items-start justify-between gap-4" key={venue.id}><div><b>{venue.name}</b><p className="mt-1 text-sm text-ink/50">{venue.address} · {venue.city}</p><p className="mt-2 text-sm">{venue.isActive ? "Active" : "Archived"}</p></div><button className="btn-secondary" onClick={() => setEditing(venue)}><Pencil className="size-4" />Edit</button></article>)}</section></div>;
}

function TeamManager({ teams, setTeams, saved }: { teams: Team[]; setTeams: React.Dispatch<React.SetStateAction<Team[]>>; saved: (message: string) => void }) {
  const [editing, setEditing] = useState<Team | null>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const name = String(form.get("name")); const team: Team = { id: editing?.id ?? crypto.randomUUID(), slug: editing?.slug ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, players: String(form.get("players")).split(",").map((value) => value.trim()).filter(Boolean), archived: form.get("archived") === "on", isDemo: true };
    setTeams((items) => editing ? items.map((item) => item.id === editing.id ? team : item) : [...items, team]); setEditing(null); event.currentTarget.reset(); saved(editing ? "Team updated." : "Team added.");
  }
  return <div className="grid gap-6 lg:grid-cols-[.7fr_1.3fr]"><form className="card grid gap-4" onSubmit={submit} key={editing?.id ?? "new"}><h2 className="font-display text-2xl font-bold">{editing ? "Edit team" : "New team"}</h2><label>Team name<input name="name" className="field mt-1" defaultValue={editing?.name} required /></label><label>Players, separated by commas<textarea name="players" className="field mt-1" defaultValue={editing?.players.join(", ")} required /></label><label className="flex gap-2"><input name="archived" type="checkbox" defaultChecked={editing?.archived} />Archived</label><button className="btn-primary"><Save className="size-4" />Save team</button></form><section className="grid content-start gap-3">{teams.map((team) => <article className="card flex justify-between gap-4" key={team.id}><div><b>{team.name}</b><p className="mt-1 text-sm text-ink/50">{team.players.join(", ")}</p>{team.archived && <p className="mt-2 text-xs text-red-700">Archived</p>}</div><button className="btn-secondary" onClick={() => setEditing(team)}><Pencil className="size-4" />Edit</button></article>)}</section></div>;
}

function ScoreManager({ shows, teams, results, setResults, saved }: { shows: Event[]; teams: Team[]; results: Result[]; setResults: React.Dispatch<React.SetStateAction<Result[]>>; saved: (message: string) => void }) {
  const [eventId, setEventId] = useState(shows.find((show) => show.status === "active")?.id ?? shows.filter((show) => show.status === "completed").at(-1)?.id ?? shows[0].id);
  const [teamId, setTeamId] = useState(teams[0].id);
  const existing = results.find((result) => result.eventId === eventId && result.teamId === teamId);
  const [rounds, setRounds] = useState(existing?.roundScores ?? [0, 0, 0, 0]);
  const [bonus, setBonus] = useState(existing?.bonusCorrect ?? [false, false, false, false]);
  const [double, setDouble] = useState<number | undefined>(existing?.doubleScoreRound);
  const [panty, setPanty] = useState(Boolean(existing?.pantyPoints));
  const [bribe, setBribe] = useState(existing?.bribePoints ?? 0);
  const [adjustment, setAdjustment] = useState(existing?.adjustments ?? 0);
  const [reason, setReason] = useState(existing?.adjustmentReason ?? "");
  const [place, setPlace] = useState(existing?.place ?? 0);
  function selectScorecard(nextEventId: string, nextTeamId: string) {
    const selected = results.find((result) => result.eventId === nextEventId && result.teamId === nextTeamId);
    setEventId(nextEventId);
    setTeamId(nextTeamId);
    setRounds(selected?.roundScores ?? [0, 0, 0, 0]);
    setBonus(selected?.bonusCorrect ?? [false, false, false, false]);
    setDouble(selected?.doubleScoreRound);
    setPanty(Boolean(selected?.pantyPoints));
    setBribe(selected?.bribePoints ?? 0);
    setAdjustment(selected?.adjustments ?? 0);
    setReason(selected?.adjustmentReason ?? "");
    setPlace(selected?.place ?? 0);
  }
  const draft: Result = { eventId, teamId, roundScores: rounds, bonusCorrect: bonus, pantyPoints: panty ? 50 : 0, bribePoints: bribe, doubleScoreRound: double, adjustments: adjustment, adjustmentReason: reason, jackpotQualified: qualifiesForJackpot(bonus), jackpotWon: existing?.jackpotWon ?? false, place, published: false };
  function save(published: boolean) {
    if (adjustment !== 0 && reason.trim().length < 4) return;
    const record = { ...draft, published };
    setResults((items) => existing ? items.map((item) => item.eventId === eventId && item.teamId === teamId ? record : item) : [...items, record]);
    saved(published ? "Score published to the leaderboard." : "Score saved as a draft.");
  }
  return <><div className="host-score-total mb-4 flex items-center justify-between gap-3 rounded-xl border border-teal bg-[#111115] p-3 xl:hidden" role="status" aria-live="polite"><div><p className="eyebrow">Total</p><p className="font-display text-3xl font-black text-gold">{scoreTotal(draft)}</p></div><p className="text-sm text-cream/80">JackPot: {draft.jackpotQualified ? "Qualified" : "Not qualified"}</p></div><div className="grid gap-6 xl:grid-cols-[1fr_.38fr]"><section className="card"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-2xl font-bold">Scorecard</h2>{existing && <span className="text-sm text-ink/50">{existing.published ? "Published result" : "Draft result"}</span>}</div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label>Show<select className="field mt-1" value={eventId} onChange={(event) => selectScorecard(event.target.value, teamId)}>{shows.map((show) => <option value={show.id} key={show.id}>{show.theme}</option>)}</select></label><label>Team<select className="field mt-1" value={teamId} onChange={(event) => selectScorecard(eventId, event.target.value)}>{teams.filter((team) => !team.archived).map((team) => <option value={team.id} key={team.id}>{team.name}</option>)}</select></label></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{rounds.map((value, index) => <label className="rounded-xl border border-ink/10 p-3" key={index}>Round {index + 1}<input className="field mt-1" type="number" value={value} onChange={(event) => setRounds((items) => items.map((item, itemIndex) => itemIndex === index ? +event.target.value : item))} /><span className="mt-2 flex items-center gap-2 text-xs"><input type="checkbox" checked={bonus[index]} onChange={(event) => setBonus((items) => items.map((item, itemIndex) => itemIndex === index ? event.target.checked : item))} />Bonus correct</span><span className="mt-2 flex items-center gap-2 text-xs"><input type="radio" name="double" checked={double === index} onChange={() => setDouble(index)} />Double score</span></label>)}</div><div className="mt-5 grid gap-4 sm:grid-cols-4"><label className="flex items-center gap-2"><input type="checkbox" checked={panty} onChange={(event) => setPanty(event.target.checked)} />Panty Points</label><label>Bribe points<input className="field mt-1" type="number" min="0" value={bribe} onChange={(event) => setBribe(+event.target.value)} /></label><label>Final place<input className="field mt-1" type="number" min="0" value={place} onChange={(event) => setPlace(+event.target.value)} /></label><label>Adjustment<input className="field mt-1" type="number" value={adjustment} onChange={(event) => setAdjustment(+event.target.value)} /></label></div>{adjustment !== 0 && <label className="mt-4 block">Required correction reason<textarea className="field mt-1" value={reason} onChange={(event) => setReason(event.target.value)} required /></label>}<button className="mt-4 text-sm text-cream/70 underline xl:hidden" onClick={() => setDouble(undefined)}>Clear Double Score</button><div className="mt-5 flex flex-wrap gap-3"><button className="btn-secondary" onClick={() => save(false)}><Save className="size-4" />Save draft</button><button className="btn-primary" onClick={() => window.confirm("Publish this score? It will affect public standings.") && save(true)}><Check className="size-4" />Publish result</button></div></section><aside className="card hidden h-fit xl:sticky xl:top-24 xl:block"><p className="eyebrow">Calculated total</p><p className="mt-2 font-display text-6xl font-black text-gold">{scoreTotal(draft)}</p><p className="mt-4 text-sm text-ink/55">JackPot: {draft.jackpotQualified ? "Qualified" : "Not qualified"}</p><p className="mt-2 text-sm text-ink/55">{draft.bonusCorrect.filter(Boolean).length}/4 bonus answers</p><button className="mt-5 text-xs text-ink/45" onClick={() => setDouble(undefined)}>Clear Double Score</button></aside></div></>;
}

function RecapManager({ shows, setShows, saved }: { shows: Event[]; setShows: React.Dispatch<React.SetStateAction<Event[]>>; saved: (message: string) => void }) {
  const completed = shows.filter((show) => show.status === "completed");
  const [eventId, setEventId] = useState(completed[0]?.id ?? "");
  const selected = shows.find((show) => show.id === eventId);
  const [recap, setRecap] = useState(selected?.recap ?? "");
  const [answers, setAnswers] = useState(selected?.funniestAnswers?.join("\n") ?? "");
  return <form className="card grid gap-4" onSubmit={(event) => { event.preventDefault(); setShows((items) => items.map((item) => item.id === eventId ? { ...item, recap, funniestAnswers: answers.split("\n").filter(Boolean) } : item)); saved("Recap saved and ready for publication."); }}><h2 className="font-display text-2xl font-bold">Show recap</h2><label>Completed show<select className="field mt-1" value={eventId} onChange={(event) => { setEventId(event.target.value); const show = shows.find((item) => item.id === event.target.value); setRecap(show?.recap ?? ""); setAnswers(show?.funniestAnswers?.join("\n") ?? ""); }}>{completed.map((show) => <option value={show.id} key={show.id}>{show.theme}</option>)}</select></label><label>Recap<textarea className="field mt-1 min-h-36" value={recap} onChange={(event) => setRecap(event.target.value)} /></label><label>Funniest answers, one per line<textarea className="field mt-1 min-h-28" value={answers} onChange={(event) => setAnswers(event.target.value)} /></label><label>Winner photo<input className="field mt-1" type="file" accept="image/*" /></label><button className="btn-primary"><Save className="size-4" />Save recap</button></form>;
}

function InquiryManager({ inquiries, setInquiries, saved }: { inquiries: DemoInquiry[]; setInquiries: React.Dispatch<React.SetStateAction<DemoInquiry[]>>; saved: (message: string) => void }) {
  const [status, setStatus] = useState<InquiryStatus | "all">("all");
  const filtered = status === "all" ? inquiries : inquiries.filter((item) => item.status === status);
  return <div><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Booking and contact inbox</p><h2 className="mt-2 font-display text-3xl font-bold">Inquiries</h2></div><label className="text-sm">Status<select className="field ml-2 w-auto" value={status} onChange={(event) => setStatus(event.target.value as InquiryStatus | "all")}><option value="all">All</option>{["new", "contacted", "qualified", "booked", "closed", "spam"].map((value) => <option key={value}>{value}</option>)}</select></label></div><div className="mt-5 grid gap-4">{filtered.map((inquiry) => <article className="card grid gap-5 lg:grid-cols-[1fr_auto]" key={inquiry.id}><div><div className="flex flex-wrap items-center gap-2"><span className="eyebrow">{inquiry.kind}</span><span className="rounded-full bg-magenta/10 px-2 py-1 text-xs text-magenta">{inquiry.status}</span></div><h3 className="mt-2 font-display text-2xl font-bold">{inquiry.name}</h3><p className="text-sm text-ink/50">{inquiry.email}{inquiry.organization ? ` · ${inquiry.organization}` : ""}</p><p className="mt-4 leading-7">{inquiry.message}</p>{inquiry.eventType && <p className="mt-3 text-sm text-ink/55">{inquiry.eventType} · {inquiry.guestCount ?? "?"} guests</p>}</div><div className="flex flex-col gap-2 lg:w-44"><a className="btn-primary" href={`mailto:${inquiry.email}`}>Reply</a><select className="field" value={inquiry.status} onChange={(event) => { const next = event.target.value as InquiryStatus; setInquiries((items) => items.map((item) => item.id === inquiry.id ? { ...item, status: next } : item)); saved(`Inquiry marked ${next}.`); }}>{["new", "contacted", "qualified", "booked", "closed", "spam"].map((value) => <option key={value}>{value}</option>)}</select></div></article>)}</div>{!filtered.length && <div className="card mt-5">Nothing in this queue.</div>}</div>;
}
