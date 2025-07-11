import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(5, { message: "Name must be  at least 5 characters" })
    .max(50, { message: "Name must be maximum of 50 characters" }),
  email: z
    .string({ invalid_type_error: " Email must be string" })
    .email({ message: "Email is invalid" })
    .min(5, { message: "Email must be at least 5 characters" })
    .max(100, { message: "Email must be maximum of 100 characters" }),
  password: z
    .string({ invalid_type_error: " Password must be string" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/.*[A-Z].*/, {
      message: `Password must be at least 1 uppercase letter`,
    })
    .regex(/.*\d.*/, { message: `Password must be at least 1 number` })
    .regex(/[!@#$%^&*?]/, {
      message: `Password must be at least 1 special character`,
    }),
  phone: z
    .string({ invalid_type_error: " Phone must be string" })
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message:
        "Phone must be valid for Bangladesh.Format : +8801XXXXXXX or 01XXXXXXXX",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: " Phone must be string" })
    .max(200, { message: "Address must be maximum of 200 characters" })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(5, { message: "Name must be  at least 5 characters" })
    .max(50, { message: "Name must be maximum of 50 characters" })
    .optional(),
  password: z
    .string({ invalid_type_error: " Password must be string" })
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/.*[A-Z].*/, {
      message: `Password must be at least 1 uppercase letter`,
    })
    .regex(/.*\d.*/, { message: `Password must be at least 1 number` })
    .regex(/[!@#$%^&*?]/, {
      message: `Password must be at least 1 special character`,
    })
    .optional(),
  isDeleted: z
    .boolean({ invalid_type_error: "isDeleted must be true or false" })
    .optional(),
  isVerified: z
    .boolean({ invalid_type_error: "isVerified must be true or false" })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive:z.enum(Object.values(IsActive)as [string]).optional(),
  phone: z
    .string({ invalid_type_error: " Phone must be string" })
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message:
        "Phone must be valid for Bangladesh.Format : +8801XXXXXXX or 01XXXXXXXX",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: " Phone must be string" })
    .max(200, { message: "Address must be maximum of 200 characters" })
    .optional(),
});