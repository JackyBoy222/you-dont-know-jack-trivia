import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { AdminApp } from "@/components/admin/AdminApp";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

async function openScoring() {
  render(<AdminApp />);
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "lagniappe" } });
  fireEvent.click(screen.getByRole("button", { name: /enter/i }));
  fireEvent.click(screen.getByRole("button", { name: "Scoring" }));
}

describe("host console", () => {
  it("loads the selected team's scores and restores saved values", async () => {
    await openScoring();
    const team = screen.getByLabelText("Team");
    const options = Array.from(team.querySelectorAll("option"));
    fireEvent.change(screen.getByLabelText("Round 1", { exact: false, selector: "input[type=number]" }), { target: { value: "987" } });
    fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
    fireEvent.change(team, { target: { value: options[1].value } });
    expect((screen.getByLabelText("Round 1", { exact: false, selector: "input[type=number]" }) as HTMLInputElement).value).not.toBe("987");
    fireEvent.change(team, { target: { value: options[0].value } });
    expect((screen.getByLabelText("Round 1", { exact: false, selector: "input[type=number]" }) as HTMLInputElement).value).toBe("987");
    const show = screen.getByLabelText("Show");
    const shows = Array.from(show.querySelectorAll("option"));
    fireEvent.change(show, { target: { value: shows.find(option => option.value !== (show as HTMLSelectElement).value)!.value } });
    expect((screen.getByLabelText("Round 1", { exact: false, selector: "input[type=number]" }) as HTMLInputElement).value).not.toBe("987");
  });

  it("keeps an empty production inbox empty even when saved state contains samples", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ state: { inquiries: [{ id: "sample", name: "Sample Inquiry", status: "new" }] }, inquiries: [] }) }));
    const client = { auth: { getSession: async () => ({ data: { session: { access_token: "test" } } }) } } as unknown as SupabaseClient;
    render(<AdminApp authenticated client={client} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "Inquiries" })).toBeTruthy());
    fireEvent.click(screen.getByRole("button", { name: "Inquiries" }));
    expect(screen.getByText("Nothing in this queue.")).toBeTruthy();
    expect(screen.queryByText("Sample Inquiry")).toBeNull();
    expect(screen.queryByText("Renee Martin")).toBeNull();
  });
});
