"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { AdminApp } from "@/components/admin/AdminApp";

type AdminGateProps = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  demoMode: boolean;
};

export function AdminGate({ supabaseUrl, supabaseAnonKey, demoMode }: AdminGateProps) {
  const client = useMemo(() => supabaseUrl && supabaseAnonKey ? createBrowserClient(supabaseUrl, supabaseAnonKey) : null, [supabaseAnonKey, supabaseUrl]);
  const [state, setState] = useState<"checking" | "signed-out" | "authorized" | "forbidden">(client && !demoMode ? "checking" : "authorized");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!client || demoMode) return;
    client.auth.getUser().then(async ({ data }) => {
      if (!data.user) return setState("signed-out");
      const { data: admin } = await client.from("admin_users").select("id").eq("id", data.user.id).maybeSingle();
      setState(admin ? "authorized" : "forbidden");
    });
  }, [client, demoMode]);

  if (demoMode || !client) return <AdminApp />;
  if (state === "checking") return <HostAccessCard title="Checking host access…" />;
  if (state === "forbidden") return <HostAccessCard title="This account is not on the host list." detail="Add this user to admin_users before granting access." />;
  if (state === "signed-out") return <SupabaseLogin client={client} error={error} setError={setError} onSuccess={() => setState("authorized")} />;
  return <AdminApp authenticated client={client} onLogout={async () => { await client.auth.signOut(); setState("signed-out"); }} />;
}

function SupabaseLogin({ client, error, setError, onSuccess }: { client: NonNullable<ReturnType<typeof createBrowserClient>>; error: string; setError: (value: string) => void; onSuccess: () => void }) {
  const [sending, setSending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSending(true); setError("");
    const form = new FormData(event.currentTarget);
    const { data, error: authError } = await client.auth.signInWithPassword({ email: String(form.get("email")), password: String(form.get("password")) });
    if (authError || !data.user) { setSending(false); setError(authError?.message ?? "Sign-in failed."); return; }
    const { data: admin } = await client.from("admin_users").select("id").eq("id", data.user.id).maybeSingle();
    setSending(false);
    if (!admin) { await client.auth.signOut(); setError("This account is not authorized for the host console."); return; }
    onSuccess();
  }
  return <div className="dark-page mx-auto max-w-md px-4 py-20"><form className="card" onSubmit={submit}><p className="eyebrow">Secure host access</p><h1 className="mt-2 font-display text-4xl font-black">Control room</h1><label className="mt-6 block">Email<input className="field mt-2" type="email" name="email" autoComplete="email" required /></label><label className="mt-4 block">Password<input className="field mt-2" type="password" name="password" autoComplete="current-password" required /></label>{error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}<button className="btn-primary mt-5 w-full" disabled={sending}>{sending ? "Checking…" : "Sign in"}</button></form></div>;
}

function HostAccessCard({ title, detail }: { title: string; detail?: string }) {
  return <div className="dark-page mx-auto max-w-md px-4 py-20"><div className="card"><p className="eyebrow">Host access</p><h1 className="mt-2 font-display text-3xl font-black">{title}</h1>{detail && <p className="mt-3 text-ink/60">{detail}</p>}</div></div>;
}
