import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const geofenceSchema = z.object({
  address: z.string().min(1, "Address is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(50, "Minimum radius is 50m").max(5000, "Maximum radius is 5km"),
  enabled: z.boolean().default(true),
});

export const timeEntrySchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  source: z.enum(["AUTO", "MANUAL"]).default("MANUAL"),
  locationLat: z.number().optional().nullable(),
  locationLng: z.number().optional().nullable(),
});

export const dateRangeSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type GeofenceInput = z.infer<typeof geofenceSchema>;
export type TimeEntryInput = z.infer<typeof timeEntrySchema>;
