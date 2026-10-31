import { SITE, waClick } from "@/lib/site";
import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  return (
    <a href={SITE.whatsapp} onClick={waClick()} target="_blank" rel="noopener noreferrer"
      aria-label="WhatsApp Melt Aways"
      className="wa-pulse fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-5 py-3 shadow-lg hover:scale-105 transition">
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline text-sm font-medium">Chat with us</span>
    </a>
  );
}