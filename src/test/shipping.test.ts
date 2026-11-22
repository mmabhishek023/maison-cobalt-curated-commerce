import { describe, expect, it } from "vitest";

import { qualifiesForFreeShipping } from "@/lib/store-config";

describe("complimentary shipping eligibility", () => {
  it("does not qualify at exactly ₹999", () => {
    expect(qualifiesForFreeShipping(999)).toBe(false);
  });

  it("qualifies above ₹999", () => {
    expect(qualifiesForFreeShipping(1000)).toBe(true);
  });
});