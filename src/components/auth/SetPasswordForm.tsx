"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

type SetPasswordFormProps = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

export function SetPasswordForm({ supabaseUrl, supabaseAnonKey }: SetPasswordFormProps) {
  const router = useRouter();
  const client = useMemo(
    () => supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null,
    [supabaseAnonKey, supabaseUrl],
  );
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!client) return;
    async function establishSession() {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const result = accessToken && refreshToken
        ? await client!.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        : await client!.auth.getSession();

      if (accessToken && refreshToken) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }

      setReady(Boolean(result.data.session));
      if (result.error || !result.data.session) {
        setError("This invitation is missing, expired, or already used. Request a new host invitation.");
      }
    }
    establishSession();
  }, [client]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;

    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("confirmation") ?? "");
    if (password !== confirmation) {
      setError("Those passwords do not match.");
      return;
    }

    setSaving(true);
    setError("");
    const { error: updateError } = await client.auth.updateUser({ password });
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    await client.auth.signOut();
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="dark-page mx-auto max-w-md px-4 py-20">
      <form className="card" onSubmit={submit}>
        <p className="eyebrow">Host invitation</p>
        <h1 className="mt-2 font-display text-4xl font-black">Set your password</h1>
        <p className="mt-3 text-ink/60">Create the password you’ll use for the private host console.</p>
        <label className="mt-6 block">
          Password
          <input className="field mt-2" type="password" name="password" minLength={10} autoComplete="new-password" required disabled={!ready || saving} />
        </label>
        <label className="mt-4 block">
          Confirm password
          <input className="field mt-2" type="password" name="confirmation" minLength={10} autoComplete="new-password" required disabled={!ready || saving} />
        </label>
        {error && <p className="mt-3 text-sm text-red-300" role="alert">{error}</p>}
        <button className="btn-primary mt-5 w-full" type="submit" disabled={!ready || saving}>
          {saving ? "Saving…" : "Save password"}
        </button>
      </form>
    </div>
  );
}
