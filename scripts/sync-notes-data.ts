import { createClient } from "@supabase/supabase-js";
import { events, results, teams, venues } from "../src/data/demo";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) throw new Error("Supabase configuration is missing.");

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
const { data, error: readError } = await supabase
  .from("app_settings")
  .select("value")
  .eq("key", "host_console_state")
  .maybeSingle();

if (readError) throw readError;

const current = (data?.value ?? {}) as Record<string, unknown>;
const value = { ...current, shows: events, teams, results, venues };
const { error: writeError } = await supabase.from("app_settings").upsert({
  key: "host_console_state",
  value,
  updated_at: new Date().toISOString(),
});

if (writeError) throw writeError;

console.log(`Synced ${events.length} shows, ${teams.length} teams, and ${results.length} confirmed results.`);
