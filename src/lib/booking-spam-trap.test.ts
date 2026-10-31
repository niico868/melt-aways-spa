import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * The hidden spam-trap field must be named "mk_hp" everywhere.
 * A field named "company" gets autofilled by browsers from saved address
 * details, so real customers fill it without knowing and the salon booking
 * API drops their booking as spam.
 */
const SRC = process.cwd();
const read = (p: string) => readFileSync(resolve(SRC, p), "utf8");

const FORMS = [
  "src/routes/booking.tsx",
  "src/routes/contact.tsx",
  "src/routes/vipconsult.tsx",
];

describe("hidden spam-trap field", () => {
  for (const file of FORMS) {
    it(`${file} renders the trap as name="mk_hp" and never as company`, () => {
      const src = read(file);
      expect(src).toContain('name="mk_hp"');
      expect(src).not.toMatch(/\bcompany\b/);
    });
  }

  it("booking-api sends mk_hp, never company, to the salon API", () => {
    const src = read("src/lib/booking-api.ts");
    expect(src).toContain('mk_hp: ""');
    expect(src).toContain("mk_hp?: string");
    expect(src).not.toMatch(/\bcompany\b/);
  });

  it("the VIP server route still rejects a filled trap", () => {
    const src = read("src/routes/api/public/submit-vip-consultation.ts");
    expect(src).toContain("body.mk_hp");
    expect(src).not.toMatch(/\bcompany\b/);
  });

  it("every form that has the trap keeps it hidden", () => {
    const src = read("src/routes/booking.tsx");
    const line = src.split("\n").find((l) => l.includes('name="mk_hp"')) ?? "";
    expect(line).toContain("tabIndex={-1}");
    expect(line).toContain('aria-hidden="true"');
    expect(line).toContain("autoComplete=\"off\"");
  });
});
