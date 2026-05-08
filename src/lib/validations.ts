import { z } from "zod";
import { kfuColleges, getMajorsForCollege } from "@/data/kfuCatalog";

export const acceptedKfuEmailDomains = ["@student.kfu.edu.sa", "@kfu.edu.sa"] as const;
export const kfuEmailPattern = /^[a-z0-9._%+-]+@(student\.)?kfu\.edu\.sa$/i;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const isKfuEmail = (email: string) => kfuEmailPattern.test(normalizeEmail(email));

export const uploadResourceSchema = z.object({
  college: z.string().min(1, "Please select a college").refine((college) => kfuColleges.includes(college as any), "Please select a valid KFU college"),
  major: z.string().min(1, "Please select a major"),
  type: z.enum(["theory", "lab_practical"], {
    required_error: "Please select Theory or Lab / Practical",
  }),
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200, "Title must be under 200 characters"),
  course_label: z.string().max(120, "Course / subject label must be under 120 characters").optional(),
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
}).superRefine((data, ctx) => {
  const majors = getMajorsForCollege(data.college);
  if (!majors.includes(data.major)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["major"], message: "Please select a major from the selected college" });
  }
});

export type UploadResourceFormData = z.infer<typeof uploadResourceSchema>;

export const profileSchema = z.object({
  display_name: z.string().trim().min(2, "Display name must be at least 2 characters").max(80),
  college: z.string().optional(),
  major: z.string().optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  avatar_url: z.string().url("Use a valid image URL").optional().or(z.literal("")),
  banner_url: z.string().url("Use a valid image URL").optional().or(z.literal("")),
});

export const reportSchema = z.object({
  reason: z.string().min(1, "Please select a reason"),
  details: z.string().max(1000).optional(),
});

export const studentEmailPattern = kfuEmailPattern;
