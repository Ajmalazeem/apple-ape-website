// lib/validators/newsletter.ts
import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("That doesn't look like a valid email")
    .max(254, "Email is too long"),
  // Honeypot — bots fill this; real users never see it.
  hp: z.string().max(0, "Spam check failed").optional().default(""),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
