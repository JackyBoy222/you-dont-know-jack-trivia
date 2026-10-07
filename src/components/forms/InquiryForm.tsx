"use client";

import { FormEvent, useState } from "react";

type InquiryFormProps = { kind: "booking" | "contact"; deliveryAvailable?: boolean };
type SubmissionState = { status: "idle" | "sending" | "success" | "error"; message: string };

export function InquiryForm({ kind, deliveryAvailable = true }: InquiryFormProps) {
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle", message: "" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!deliveryAvailable) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    if (payload.guestCount === "") delete payload.guestCount;

    setSubmission({ status: "sending", message: "Sending…" });
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, kind }),
      });
      const result = await response.json().catch(() => ({})) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || "The message did not go through.");
      form.reset();
      setSubmission({ status: "success", message: result.message || "Message received." });
    } catch (error) {
      setSubmission({ status: "error", message: error instanceof Error ? error.message : "The message did not go through." });
    }
  }

  return <form className="card grid gap-4" aria-label={kind === "booking" ? "Booking inquiry" : "General contact form"} onSubmit={submit}>
    <h2 className="font-display text-3xl font-bold">{kind === "booking" ? "Tell Jack about the room" : "Send a message"}</h2>
    {!deliveryAvailable && <p role="status" className="rounded-xl border border-gold/40 bg-gold/10 p-3 text-sm text-cream">Online messages aren&apos;t available yet. <a className="underline" href="https://www.instagram.com/you.dont.know.jack.trivia/">Contact Jack on Instagram</a> for questions or bookings.</p>}
    <label>Name<input className="field mt-2" name="name" autoComplete="name" maxLength={100} required /></label>
    <label>Email<input className="field mt-2" name="email" type="email" autoComplete="email" maxLength={254} required /></label>
    {kind === "booking" ? <>
      <label>Organization or venue <span className="text-sm text-ink/60">(optional)</span><input className="field mt-2" name="organization" autoComplete="organization" maxLength={160} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>Event type<select className="field mt-2" name="eventType" defaultValue="private"><option value="weekly">Weekly venue trivia</option><option value="private">Private party</option><option value="corporate">Corporate event</option><option value="fundraiser">Fundraiser</option><option value="special">Special event</option></select></label>
        <label>Estimated guests <span className="text-sm text-ink/60">(optional)</span><input className="field mt-2" name="guestCount" type="number" min="1" max="10000" inputMode="numeric" /></label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>Preferred date <span className="text-sm text-ink/60">(optional)</span><input className="field mt-2" name="eventDate" type="date" /></label>
        <label>Event location <span className="text-sm text-ink/60">(optional)</span><input className="field mt-2" name="venue" autoComplete="street-address" maxLength={200} /></label>
      </div>
      <label>What are you planning?<textarea className="field mt-2 min-h-32" name="message" minLength={10} maxLength={4000} required /></label>
    </> : <>
      <label>Subject <span className="text-sm text-ink/60">(optional)</span><input className="field mt-2" name="subject" maxLength={160} /></label>
      <label>Message<textarea className="field mt-2 min-h-36" name="message" minLength={10} maxLength={4000} required /></label>
    </>}
    <label className="absolute left-[-10000px]" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <button className="btn-primary" type="submit" disabled={!deliveryAvailable || submission.status === "sending"}>{submission.status === "sending" ? "Sending…" : kind === "booking" ? "Request availability" : "Send it"}</button>
    <p className={`min-h-5 text-sm ${submission.status === "success" ? "text-emerald" : submission.status === "error" ? "text-red-300" : "text-ink/45"}`} aria-live="polite" role={submission.status === "error" ? "alert" : "status"}>
      {submission.message || "Your information is used only to respond to this inquiry."}
    </p>
  </form>;
}
