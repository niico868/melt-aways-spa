/**
 * Single source of truth for the salon's external booking API.
 * Every request to the salon booking system must use BOOKING_API_URL.
 * No API key / Authorization headers — the API only accepts requests
 * from https://meltawaysspa.com and https://www.meltawaysspa.com.
 */
export const BOOKING_API_URL =
  "https://kwtfqqwtffzbmfsjrswf.supabase.co/functions/v1/website-booking";

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
  email?: string;
  message: string;
  mk_hp?: string;
}): Promise<boolean> {
  try {
    const res = await fetch(BOOKING_API_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "enquiry", mk_hp: "", ...payload }),
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
