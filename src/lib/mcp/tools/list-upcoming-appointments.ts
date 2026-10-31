import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_upcoming_appointments",
  title: "List upcoming appointments",
  description:
    "List upcoming appointments in the Melt Away Spa Digital Hub. Access is limited by row-level security to what the signed-in user is allowed to see.",
  inputSchema: {
    days_ahead: z
      .number()
      .int()
      .min(1)
      .max(90)
      .default(7)
      .describe("How many days ahead to look. Defaults to 7."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(200)
      .default(50)
      .describe("Maximum appointments to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ days_ahead, limit }, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
        auth: { persistSession: false, autoRefreshToken: false },
      },
    );
    const now = new Date();
    const until = new Date(now.getTime() + days_ahead * 24 * 60 * 60 * 1000);
    const { data, error } = await supabase
      .from("appointments")
      .select(
        "id, scheduled_at, duration_min, status, customer:customers(full_name, phone), service:services(name)",
      )
      .gte("scheduled_at", now.toISOString())
      .lte("scheduled_at", until.toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(limit);
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { appointments: data ?? [] },
    };
  },
});