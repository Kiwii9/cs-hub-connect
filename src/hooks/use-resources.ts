import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

export type ResourceInput = {
  course_id?: string | null;
  college: string;
  major: string;
  course_label?: string | null;
  type: "theory" | "lab_practical";
  title: string;
  description?: string;
  academic_year: string;
  semester: string;
  batch_year: number;
  lecturer_id?: string | null;
  section?: string;
  tags?: string[];
  week?: number;
  topic?: string;
  file_url?: string;
  link_url?: string;
  text_content?: string;
  uploader_id: string;
  status?: "pending" | "active" | "reported" | "removed";
};

export const useResourcesByCourse = (courseId: string) => useQuery({
  queryKey: ["resources", "course", courseId],
  queryFn: async () => {
    const { data, error } = await db.from("resources").select("*, lecturers(name), courses(code, name, id, college, major)").eq("course_id", courseId).eq("status", "active").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
  enabled: !!courseId,
});

export const useResourcesByMajor = (college: string, major: string) => useQuery({
  queryKey: ["resources", "major", college, major],
  queryFn: async () => {
    const { data, error } = await db
      .from("resources")
      .select("*, lecturers(name), courses(code, name, id, college, major)")
      .eq("college", college)
      .eq("major", major)
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
  enabled: !!college && !!major,
});

export const useResource = (id: string) => useQuery({
  queryKey: ["resource", id],
  queryFn: async () => {
    const { data, error } = await db.from("resources").select("*, lecturers(name), courses(code, name, id, college, major), profiles(display_name, avatar_url, major)").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  },
  enabled: !!id,
});

export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (resource: ResourceInput) => {
      const { data, error } = await db.from("resources").insert({ ...resource, status: resource.status ?? "pending" }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      if (data?.uploader_id) queryClient.invalidateQueries({ queryKey: ["my-resources", data.uploader_id] });
    },
  });
};

export const useMyResources = (userId: string) => useQuery({
  queryKey: ["my-resources", userId],
  queryFn: async () => {
    const { data, error } = await db.from("resources").select("*, lecturers(name), courses(code, name)").eq("uploader_id", userId).order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
  enabled: !!userId,
});

export const usePendingResources = () => useQuery({
  queryKey: ["pending-resources"],
  queryFn: async () => {
    const { data, error } = await db.from("resources").select("*, profiles(display_name), courses(code, name)").eq("status", "pending").order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const useApproveResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("resources").update({ status: "active" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-resources"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("resources").delete().eq("id", id);
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
    const { data, error } = await db.from("resources").select("type").eq("course_id", courseId).eq("status", "active");
    if (error) throw error;
    return {
      theory: (data ?? []).filter((r: any) => r.type === "theory" || r.type === "notes" || r.type === "summary" || r.type === "lecture_link").length,
      lab_practical: (data ?? []).filter((r: any) => r.type === "lab_practical" || r.type === "practice").length,
      total: data?.length ?? 0,
    };
  },
  enabled: !!courseId,
});

export const useResourceComments = (resourceId: string) => useQuery({
  queryKey: ["resource-comments", resourceId],
  queryFn: async () => {
    const { data, error } = await db.from("resource_comments").select("*, profiles(display_name, avatar_url)").eq("resource_id", resourceId).order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
  enabled: !!resourceId,
});

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comment: { resource_id: string; user_id: string; body: string }) => {
      const { data, error } = await db.from("resource_comments").insert(comment).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["resource-comments", data.resource_id] }),
  });
};

export const useResourceReactionCounts = (resourceId: string) => useQuery({
  queryKey: ["resource-reactions", resourceId],
  queryFn: async () => {
    const { data, error } = await db.from("resource_reactions").select("reaction_type").eq("resource_id", resourceId);
    if (error) throw error;
    const rows = data ?? [];
    return {
      upvote: rows.filter((r: any) => r.reaction_type === "upvote").length,
      praise: rows.filter((r: any) => r.reaction_type === "praise").length,
    };
  },
  enabled: !!resourceId,
});

export const useToggleReaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ resource_id, user_id, reaction_type }: { resource_id: string; user_id: string; reaction_type: "upvote" | "praise" }) => {
      const { data: existing, error: findError } = await db
        .from("resource_reactions")
        .select("id")
        .eq("resource_id", resource_id)
        .eq("user_id", user_id)
        .eq("reaction_type", reaction_type)
        .maybeSingle();
      if (findError) throw findError;
      if (existing?.id) {
        const { error } = await db.from("resource_reactions").delete().eq("id", existing.id);
        if (error) throw error;
        return { resource_id };
      }
      const { error } = await db.from("resource_reactions").insert({ resource_id, user_id, reaction_type });
      if (error) throw error;
      return { resource_id };
    },
    onSuccess: ({ resource_id }) => queryClient.invalidateQueries({ queryKey: ["resource-reactions", resource_id] }),
  });
};
