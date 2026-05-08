import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

export const useMyProfile = (userId: string) => useQuery({
  queryKey: ["profile", userId],
  queryFn: async () => {
    const { data, error } = await db.from("profiles").select("*").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    return data;
  },
  enabled: !!userId,
});

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, values }: { userId: string; values: Record<string, unknown> }) => {
      const { data, error } = await db
        .from("profiles")
        .upsert({ user_id: userId, ...values, updated_at: new Date().toISOString() }, { onConflict: "user_id" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["profile", data.user_id] }),
  });
};
