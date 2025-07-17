import z from "zod";

export const createDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be sting" })
    .min(5, { message: "name must be at least 5 characters" }),
  slug: z
    .string({ invalid_type_error: "Slug must be sting" })
    .min(5, { message: "name must be at least 5 characters" })
    .optional(),
  thumbnail: z
    .string({ invalid_type_error: "Name must be sting" })
    .min(5, { message: "name must be at least 5 characters" })
    .optional(),
  description: z
    .string({ invalid_type_error: "Name must be sting" })
    .min(10, { message: "name must be at least 5 characters" })
    .optional(),
});
export const updateDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be sting" })
    .min(5, { message: "name must be at least 5 characters" })
    .optional(),
  slug: z
    .string({ invalid_type_error: "Slug must be sting" })
    .min(5, { message: "name must be at least 5 characters" })
    .optional(),
  thumbnail: z
    .string({ invalid_type_error: "Name must be sting" })
    .min(5, { message: "name must be at least 5 characters" })
    .optional(),
  description: z
    .string({ invalid_type_error: "Name must be sting" })
    .min(10, { message: "name must be at least 5 characters" })
    .optional(),
});
