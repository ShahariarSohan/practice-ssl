import { z } from "zod";

export const createTourTypeZodSchema = z.object({
  name: z.string(),
});
export const updateTourTypeZodSchema = z.object({
  name: z.string().optional(),
});

export const createTourZodSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  costFrom: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuest: z.number().optional(),
  minAge: z.number().optional(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional(),
  tourType: z.string(),
  division: z.string(),
});

export const updateTourZodSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  costFrom: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuest: z.number().optional(),
  minAge: z.number().optional(),
  departureLocation: z.string().optional(),
  arrivalLocation: z.string().optional(),
  tourType: z.string().optional(),
  division: z.string().optional(),
  deleteImages: z.array(z.string()).optional(),
});
