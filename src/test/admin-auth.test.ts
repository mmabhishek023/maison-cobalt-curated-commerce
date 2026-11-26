import { describe, expect, it } from "vitest";

import { hasAdminRole } from "@/lib/admin-auth";

describe("administrator role access", () => {
  it("accepts the admin role and rejects customer or missing roles", () => {
    expect(hasAdminRole([{ role: "admin" }])).toBe(true);
    expect(hasAdminRole([{ role: "customer" }])).toBe(false);
    expect(hasAdminRole([])).toBe(false);
    expect(hasAdminRole(null)).toBe(false);
  });
});