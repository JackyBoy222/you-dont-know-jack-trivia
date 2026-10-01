import { createSupabaseAdmin } from "@/lib/supabase/server";

async function authorizedAdmin(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const supabase = createSupabaseAdmin();
  if (!token || !supabase) return null;

  const { data: auth, error: authError } = await supabase.auth.getUser(token);
  if (authError || !auth.user) return null;

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", auth.user.id)
    .maybeSingle();

  return admin ? supabase : null;
}

export async function GET(request: Request) {
  const supabase = await authorizedAdmin(request);
  if (!supabase) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const [{ data: setting, error: settingError }, { data: inquiries, error: inquiryError }] =
    await Promise.all([
      supabase.from("app_settings").select("value").eq("key", "host_console_state").maybeSingle(),
      supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
    ]);

  if (settingError || inquiryError) {
    return Response.json(
      { error: settingError?.message ?? inquiryError?.message ?? "Unable to load host data." },
      { status: 500 },
    );
  }

  return Response.json({ state: setting?.value ?? null, inquiries: inquiries ?? [] });
}

export async function PUT(request: Request) {
  const supabase = await authorizedAdmin(request);
  if (!supabase) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.state || typeof body.state !== "object") {
    return Response.json({ error: "Invalid host-console state." }, { status: 400 });
  }

  const serialized = JSON.stringify(body.state);
  if (serialized.length > 2_000_000) {
    return Response.json({ error: "Host-console state is too large." }, { status: 413 });
  }

  const { error: saveError } = await supabase.from("app_settings").upsert({
    key: "host_console_state",
    value: body.state,
    updated_at: new Date().toISOString(),
  });
  if (saveError) return Response.json({ error: saveError.message }, { status: 500 });

  const inquiryUpdates: Array<{ id: string; status: string }> = Array.isArray(body.state.inquiries)
    ? body.state.inquiries.filter(
        (item: unknown): item is { id: string; status: string } =>
          Boolean(
            item &&
              typeof item === "object" &&
              "id" in item &&
              "status" in item &&
              typeof item.id === "string" &&
              typeof item.status === "string" &&
              /^[0-9a-f-]{36}$/i.test(item.id),
          ),
      )
    : [];

  const results = await Promise.all(
    inquiryUpdates.map((item) =>
      supabase
        .from("inquiries")
        .update({ status: item.status, updated_at: new Date().toISOString() })
        .eq("id", item.id),
    ),
  );
  const inquiryUpdateError = results.find((result) => result.error)?.error;
  if (inquiryUpdateError) {
    return Response.json({ error: inquiryUpdateError.message }, { status: 500 });
  }

  return Response.json({ saved: true });
}
