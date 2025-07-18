import z from "zod";

export const createDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be sting" })
    .min(3, { message: "name must be at least 5 characters" }),
  thumbnail: z
    .string({ invalid_type_error: "Thumbnail must be sting" })
    .min(5, { message: "Thumbnail must be at least 5 characters" })
    .optional(),
  description: z
    .string({ invalid_type_error: "description must be sting" })
    .min(10, { message: "description must be at least 5 characters" })
    .optional(),
});
export const updateDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be sting" })
    .min(3, { message: "name must be at least 5 characters" })
    .optional(),
  thumbnail: z
    .string({ invalid_type_error: "Thumbnail must be sting" })
    .min(5, { message: "Thumbnail must be at least 5 characters" })
    .optional(),
  description: z
    .string({ invalid_type_error: "description must be sting" })
    .min(10, { message: "description must be at least 5 characters" })
    .optional(),
});
