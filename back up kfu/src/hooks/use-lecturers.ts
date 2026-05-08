import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLecturers = () => {
  return useQuery({
    queryKey: ["lecturers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lecturers")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
};
