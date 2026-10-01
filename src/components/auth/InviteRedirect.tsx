"use client";

import { useEffect } from "react";

export function InviteRedirect() {
  useEffect(() => {
    const isPasswordLink = window.location.hash.includes("type=invite") || window.location.hash.includes("type=recovery");
    if (isPasswordLink && window.location.pathname !== "/admin/setup") {
      window.location.replace(`/admin/setup${window.location.hash}`);
    }
  }, []);

  return null;
}
