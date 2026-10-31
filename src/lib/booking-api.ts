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
 * Fire-and-forget enquiry forward to the salon booking API.
 * Never throws, never shows errors to the customer — failures are only
 * logged to the console because the submission is already saved in
 * Lovable Cloud.
 */
export async function postEnquiry(payload: {
  source: "treatment-finder" | "consultation" | "visit" | "contact";
  name: string;
  phone: string;
  email?: string;
  message: string;
  mk_hp?: string;
}): Promise<void> {
  try {
    await fetch(BOOKING_API_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "enquiry", mk_hp: "", ...payload }),
    });
  } catch (err) {
    console.log("Salon booking API enquiry forward failed:", err);
  }
}
