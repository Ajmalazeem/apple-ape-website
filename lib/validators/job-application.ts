// lib/validators/job-application.ts
import { z } from "zod";

export const jobApplicationSchema = z.object({
  job_id:       z.string().uuid("Invalid job id"),
  name:         z.string().trim().min(1, "Name is required").max(100),
  email:        z.string().trim().min(1).email("Invalid email").max(254),
  resume_url:   z.string().url("Provide a public link to your résumé").optional().or(z.literal("")).transform((v) => (v ? v : null)),
  cover_letter: z.string().trim().max(8000).optional().default(""),
  hp:           z.string().max(0, "Spam check failed").optional().default(""),
});

export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
