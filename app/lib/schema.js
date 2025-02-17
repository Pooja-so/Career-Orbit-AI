// To track whether user has entered correct detail in correct format
// into the form or not we'll be using schema [zod]

import { z } from "zod";

// On-Boarding Form fields validation
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

  skills: z
    .string()
    .transform((value) =>
      value
        ? value.split(",").map((skill) => skill.trim()).filter(Boolean)
        : undefined
    ),
});
