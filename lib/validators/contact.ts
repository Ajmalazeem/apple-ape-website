// lib/validators/contact.ts
import { z } from "zod";

export const contactSchema = z.object({
  name:    z.string().trim().min(1, "Name is required").max(100),
  email:   z.string().trim().min(1, "Email is required").email("That doesn't look like a valid email").max(254),
  subject: z.string().trim().max(150).optional().default(""),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(4000, "Message is too long"),
  hp:      z.string().max(0, "Spam check failed").optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
