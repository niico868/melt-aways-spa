import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isValidEmail } from "./booking-api";

/**
 * Every form that reaches the salon must collect a valid email: the salon API
 * rejects anything without one, and uses it to send the client's confirmation.
 */
const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

describe("client email", () => {
  it("accepts real addresses and refuses the rest", () => {
    for (const ok of ["ana@gmail.com", " first.last+spa@mail.example.tt "]) expect(isValidEmail(ok)).toBe(true);
    for (const bad of ["", "ana", "ana@", "ana@gmail", "ana@gmail.c", "a b@c.com"]) expect(isValidEmail(bad)).toBe(false);
  });

  it.each([
    "src/routes/booking.tsx",
    "src/routes/contact.tsx",
    "src/routes/visiting.tsx",
    "src/routes/treatment-finder.tsx",
  ])("%s requires and checks the email", (file) => {
    const src = read(file);
    expect(src).toMatch(/type="email"[^>]*required|required[^>]*type="email"/);
    expect(src).toContain("isValidEmail(");
  });

  it("the VIP consultation form checks the email on step 1", () => {
    expect(read("src/lib/vip-consult.ts")).toContain('e.email = "Please enter a valid email address."');
  });

  it("enquiries cannot be sent without an email", () => {
    expect(read("src/lib/booking-api.ts")).toMatch(/\n  email: string;\n/);
  });
});
