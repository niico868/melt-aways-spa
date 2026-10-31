import { describe, it, expect } from "vitest";
import { availableSlots, isDateDisabled, toIso } from "./booking-slots";

const now = Date.parse("2026-10-19T09:00:00-04:00"); // Monday morning
const days = [2, 3, 4, 5, 6];

describe("booking slots", () => {
  it("disables Sundays, Mondays and past dates", () => {
    expect(isDateDisabled("2026-10-18", days, now)).toBe(true); // Sunday
    expect(isDateDisabled("2026-10-19", days, now)).toBe(true); // Monday
    expect(isDateDisabled("2026-10-17", days, now)).toBe(true); // past Saturday
    expect(isDateDisabled("2026-10-20", days, now)).toBe(false); // Tuesday
  });

  it("offers 30-min starts from 10:00 that finish by 4:00 PM", () => {
    const s = availableSlots({ date: "2026-10-20", durationMin: 60, busy: [], now });
    expect(s[0]).toBe("10:00");
    expect(s[1]).toBe("10:30");
    expect(s.at(-1)).toBe("15:00");
  });

  it("hides times overlapping a busy period", () => {
    const busy = [{ starts_at: "2026-10-20T12:00:00-04:00", ends_at: "2026-10-20T13:00:00-04:00" }];
    const s = availableSlots({ date: "2026-10-20", durationMin: 60, busy, now });
    expect(s).toContain("11:00");
    expect(s).not.toContain("11:30");
    expect(s).not.toContain("12:30");
    expect(s).toContain("13:00");
  });

  it("hides times less than 1 hour from now", () => {
    const n = Date.parse("2026-10-20T10:45:00-04:00");
    const s = availableSlots({ date: "2026-10-20", durationMin: 30, busy: [], now: n });
    expect(s[0]).toBe("12:00");
  });

  it("formats starts_at with the -04:00 offset", () => {
    expect(toIso("2026-10-20", "14:00")).toBe("2026-10-20T14:00:00-04:00");
  });
});
