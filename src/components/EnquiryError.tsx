import { SITE, waLink } from "@/lib/site";

/**
 * Shown when postEnquiry() returns false: the salon dashboard didn't get
 * the enquiry, so point the client to phone / WhatsApp instead.
 */
export function EnquiryError({ message }: { message?: string }) {
  return (
    <div role="alert" className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
      Sorry, we couldn't send your request just now. Please call us on{" "}
      <a href={`tel:+${SITE.phoneDigits}`} className="underline font-medium">{SITE.phone}</a>{" "}
      or{" "}
      <a href={waLink(message)} target="_blank" rel="noopener noreferrer" className="underline font-medium">
        message us on WhatsApp
      </a>
      .
    </div>
  );
}
