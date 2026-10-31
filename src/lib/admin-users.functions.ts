import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type AppRole = "admin" | "manager" | "staff" | "receptionist";

async function assertAdmin(context: any) {
  const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden — admin only");
}

export const listAccounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
    if (error) throw new Error(error.message);
    const { data: profiles } = await supabaseAdmin.from("profiles").select("id, full_name");
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p.full_name]));
    const rolesMap = new Map<string, string[]>();
    (roles ?? []).forEach((r: any) => {
      const arr = rolesMap.get(r.user_id) ?? [];
      arr.push(r.role); rolesMap.set(r.user_id, arr);
    });
    return users.users.map(u => ({
      id: u.id,
      email: u.email ?? "",
      full_name: profileMap.get(u.id) ?? (u.user_metadata?.full_name ?? ""),
      roles: rolesMap.get(u.id) ?? [],
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      invited: !u.last_sign_in_at,
    }));
  });

export const inviteAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string; full_name: string; role: AppRole }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const siteUrl = process.env.SITE_URL || "https://melt-always-spa.lovable.app";
    const { data: created, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
      data: { full_name: data.full_name },
      redirectTo: `${siteUrl}/set-password`,
    });
    if (error) throw new Error(error.message);
    const uid = created.user?.id;
    if (uid) {
      await supabaseAdmin.from("profiles").upsert({ id: uid, full_name: data.full_name, role: data.role });
      await supabaseAdmin.from("user_roles").upsert({ user_id: uid, role: data.role }, { onConflict: "user_id,role" });
    }
    return { ok: true, id: uid };
  });

export const setAccountRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { user_id: string; role: AppRole }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id);
    const { error } = await supabaseAdmin.from("user_roles").insert({ user_id: data.user_id, role: data.role });
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("profiles").update({ role: data.role }).eq("id", data.user_id);
    return { ok: true };
  });

export const deleteAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { user_id: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.user_id === context.userId) throw new Error("You cannot delete your own account");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });