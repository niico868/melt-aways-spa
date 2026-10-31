import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "manager" | "staff" | "receptionist";

export function useMyRoles() {
  return useQuery({
    queryKey: ["my-roles"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return [] as AppRole[];
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      if (error) return [] as AppRole[];
      return (data ?? []).map((r: any) => r.role as AppRole);
    },
    staleTime: 60_000,
  });
}

export function useCanWrite() {
  const { data: roles } = useMyRoles();
  return !!roles?.some(r => r === "admin" || r === "manager");
}

export function useIsAdmin() {
  const { data: roles } = useMyRoles();
  return !!roles?.includes("admin");
}