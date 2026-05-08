import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*, resources(title, id)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (report: {
      resource_id: string;
      reporter_id: string;
      reason: string;
      details?: string;
    }) => {
      const { data, error } = await supabase
        .from("reports")
        .insert(report)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

export const useDismissReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabase
        .from("reports")
        .update({ status: "dismissed" })
        .eq("id", reportId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

export const useRemoveResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reportId, resourceId }: { reportId: string; resourceId: string }) => {
      const { error: resError } = await supabase
        .from("resources")
        .update({ status: "removed" })
        .eq("id", resourceId);
      if (resError) throw resError;
      const { error: repError } = await supabase
        .from("reports")
        .update({ status: "reviewed" })
        .eq("id", reportId);
      if (repError) throw repError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
};
