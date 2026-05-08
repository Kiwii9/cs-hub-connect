import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useResourcesByCourse = (courseId: string) => useQuery({
  queryKey: ["resources", courseId],
  queryFn: async () => {
    const { data, error } = await supabase.from("resources").select("*, lecturers(name)").eq("course_id", courseId).eq("status", "active").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  enabled: !!courseId,
});

export const useResource = (id: string) => useQuery({
  queryKey: ["resource", id],
  queryFn: async () => {
    const { data, error } = await supabase.from("resources").select("*, lecturers(name), courses(code, name, id)").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  },
  enabled: !!id,
});

export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (resource: { course_id: string; type: "notes" | "lecture_link"; title: string; description?: string; academic_year: string; semester: string; batch_year: number; lecturer_id?: string; section?: string; tags?: string[]; week?: number; topic?: string; file_url?: string; link_url?: string; text_content?: string; uploader_id: string; }) => {
      const { data, error } = await supabase.from("resources").insert(resource).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["resources", data.course_id] }),
  });
};

export const useMyResources = (userId: string) => useQuery({
  queryKey: ["my-resources", userId],
  queryFn: async () => {
    const { data, error } = await supabase.from("resources").select("*, lecturers(name), courses(code, name)").eq("uploader_id", userId).order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  enabled: !!userId,
});

export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("resources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-resources"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
};

export const useResourceCountsByCourse = (courseId: string) => useQuery({
  queryKey: ["resource-counts", courseId],
  queryFn: async () => {
    const { data, error } = await supabase.from("resources").select("type").eq("course_id", courseId).eq("status", "active");
    if (error) throw error;
    return { notes: data.filter(r => r.type === "notes").length, lecture_link: data.filter(r => r.type === "lecture_link").length, total: data.length };
  },
  enabled: !!courseId,
});
