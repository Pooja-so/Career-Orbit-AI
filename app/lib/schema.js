// To track whether user has entered correct detail in correct format
// into the form or not we'll be using schema [zod]

import { z } from "zod";

// --------------------1. On-Boarding Form fields validation ---------------------------------
export const onboardingSchema = z.object({
  industry: z.string({
    required_error: "Please select an industry",
  }),

  subIndustry: z.string({
    required_error: "Please select an specialization",
  }),

  bio: z.string().max(500).optional(),

  experience: z
    .string()
    .transform((value) => parseInt(value, 10))
    .pipe(
      z
        .number()
        .min(0, "Experience must be atleast 0 years")
        .max(50, "Experience cannot exceed 50 years")
    ),

  skills: z.string().transform((value) =>
    value
      ? value
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : undefined
  ),
});

// --------------------2. Resume Form fields validation ---------------------------------
export const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

export const entrySchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    current: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // When neither current date nor end Date is provided for experience field, it will throw an error for required field
      if (!data.current && !data.endDate) {
        return false;
      }
      // when either of them is provided, it won't throw an error
      return true;
    },
    {
      // error message
      message: "End date is required unless this is your current position",
      path: ["endDate"],
    }
  );

// Combining both contactSchema and entrySchema into one resumeSchema
export const resumeSchema = z.object({
  contactInfo: contactSchema,
  summary: z.string().min(1, "Professional summary is required"),
  skills: z.string().min(1, "Skills are required"),
  experience: z.array(entrySchema),
  education: z.array(entrySchema),
  projects: z.array(entrySchema),
});
