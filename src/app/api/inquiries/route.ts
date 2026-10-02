import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { inquirySchema } from "@/lib/validation";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ ok: false, message: "Send this form as JSON." }, { status: 415 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Check the form and try again.",
    }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true, message: "Thanks. Your message is in the queue." });
  }

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({
      ok: false,
      demo: true,
      message: "The form is ready, but delivery is not connected yet. Add Supabase credentials to begin receiving inquiries.",
    }, { status: 503 });
  }

  const data = parsed.data;
  const { error } = await supabase.from("inquiries").insert({
    kind: data.kind,
    name: data.name,
    email: data.email,
    organization: data.organization || null,
    message: data.message,
    event_type: data.kind === "booking" ? data.eventType : null,
    event_date_text: data.kind === "booking" ? data.eventDate || null : null,
    guest_count: data.kind === "booking" ? data.guestCount ?? null : null,
    venue: data.kind === "booking" ? data.venue || null : null,
    subject: data.kind === "contact" ? data.subject || null : null,
    source: "website",
    status: "new",
  });

  if (error) {
    console.error("Inquiry insert failed", error.code);
    return NextResponse.json({ ok: false, message: "The message did not go through. Please try again shortly." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: data.kind === "booking"
      ? "Your inquiry is in. Jack will follow up with you."
      : "Message received. Jack will get back to you.",
  });
}
