import { z } from "zod";

export const acceptedKfuEmailDomains = ["@student.kfu.edu.sa", "@kfu.edu.sa"] as const;
export const kfuEmailPattern = /^[a-z0-9._%+-]+@(student\.)?kfu\.edu\.sa$/i;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const isKfuEmail = (email: string) => kfuEmailPattern.test(normalizeEmail(email));

export const uploadResourceSchema = z.object({
  course_id: z.string().uuid("Please select a course"),
  type: z.enum(["notes", "lecture_link"], {
    required_error: "Please select a resource type",
  }),
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200, "Title must be under 200 characters"),
  academic_year: z.string().regex(/^\d{4}-\d{4}$/, "Use format YYYY-YYYY"),
  semester: z.enum(["1", "2", "Summer"], { required_error: "Please select a semester" }),
  batch_year: z.string().regex(/^\d{4}$/, "Must be a 4-digit year"),
  lecturer_id: z.string().uuid("Please select a valid lecturer").optional().or(z.literal("")),
  section: z.string().optional(),
  week: z.coerce.number().min(1).max(16).optional().or(z.literal("")),
  topic: z.string().max(200).optional(),
  tags: z.string().optional(),
  description: z.string().max(2000).optional(),
  link_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  text_content: z.string().max(50000).optional(),
});

export type UploadResourceFormData = z.infer<typeof uploadResourceSchema>;

export const reportSchema = z.object({
  reason: z.string().min(1, "Please select a reason"),
  details: z.string().max(1000).optional(),
});

export const studentEmailPattern = kfuEmailPattern;
