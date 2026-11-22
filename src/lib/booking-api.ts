/**
 * Single source of truth for the salon's external booking API.
 * Every request to the salon booking system must use BOOKING_API_URL.
 * No API key / Authorization headers — the API only accepts requests
 * from https://meltawaysspa.com and https://www.meltawaysspa.com.
 */
export const BOOKING_API_URL =
  "https://kwtfqqwtffzbmfsjrswf.supabase.co/functions/v1/website-booking";

/**
 * Email is required on every form: the salon API rejects a booking or
 * enquiry without one, and uses it to send the client's confirmation.
 * Same rule as the API, so anything that passes here is accepted there.
 */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isValidEmail = (email: string) => EMAIL_RE.test(email.trim()) && email.trim().length <= 200;
export const EMAIL_ERROR = "Please enter a valid email address so we can send your confirmation.";

/** Normalize a service name for matching: lowercase, alphanumeric only. */
export function normalizeServiceName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Send an enquiry to the salon dashboard API.
 * This is the only place form enquiries are delivered — the website no
 * longer saves them to Lovable Cloud — so callers must check the result.
 * Never throws. Resolves `true` when the API accepted the enquiry (2xx),
 * `false` on any network error or non-2xx response, so the form can show
 * the client an error with the salon's phone/WhatsApp instead.
 */
export async function postEnquiry(payload: {
  source: "treatment-finder" | "consultation" | "visit" | "contact";
  name: string;
  phone: string;
  email: string;
  message: string;
  mk_hp?: string;
}): Promise<boolean> {
  try {
    const res = await fetch(BOOKING_API_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "enquiry", mk_hp: "", ...payload, email: payload.email.trim() }),
    });
    if (!res.ok) {
      console.log("Salon booking API rejected enquiry:", res.status);
      return false;
    }
    return true;
  } catch (err) {
    console.log("Salon booking API enquiry failed:", err);
    return false;
  }
}
