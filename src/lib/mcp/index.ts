import { auth, defineMcp } from "@lovable.dev/mcp-js";
import whoamiTool from "./tools/whoami";
import listServicesTool from "./tools/list-services";
import listUpcomingAppointmentsTool from "./tools/list-upcoming-appointments";

// The OAuth issuer must be the direct Supabase host, not the .lovable.cloud proxy.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "melt-away-spa-mcp",
  title: "Melt Away Spa Digital Hub",
  version: "0.1.0",
  instructions:
    "Tools for the Melt Away Spa Digital Hub. Use `whoami` to confirm the signed-in user, `list_services` for the treatment menu, and `list_upcoming_appointments` to see scheduled bookings. All data access respects the app's row-level security.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [whoamiTool, listServicesTool, listUpcomingAppointmentsTool],
});