import { z } from "zod";

export const eventSchema = z.object({
  theme: z.string().min(2, "Theme needs at least 2 characters"),
  date: z.string().min(1, "Choose a date"),
  jackpot: z.coerce.number().min(0),
  venue: z.string().min(2),
});

export const teamSchema = z.object({
  name: z.string().min(2),
  players: z.array(z.string().min(1)).min(1),
});

const inquiryBase = z.object({
  name: z.string().trim().min(2, "Tell us your name.").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  organization: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(10, "Give Jack at least a little context.").max(4000),
  // Honeypot values are accepted by validation so the route can return a
  // generic success response instead of revealing the spam check.
  website: z.string().max(500).optional().default(""),
});

export const bookingInquirySchema = inquiryBase.extend({
  kind: z.literal("booking"),
  eventType: z.enum(["weekly", "private", "corporate", "fundraiser", "special"]),
  eventDate: z.string().trim().refine(
    (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
    "Choose a valid event date.",
  ).optional().default(""),
  guestCount: z.coerce.number().int().min(1).max(10000).optional(),
  venue: z.string().trim().max(200).optional().default(""),
});

export const contactInquirySchema = inquiryBase.extend({
  kind: z.literal("contact"),
  subject: z.string().trim().max(160).optional().default("General question"),
});

export const inquirySchema = z.discriminatedUnion("kind", [
  bookingInquirySchema,
  contactInquirySchema,
]);
