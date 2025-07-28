import z from "zod";
import { GUIDE_STATUS } from "./guide.interface";

export const guideApplyZodSchema = z.object({
  
    division: z.string(),
});

export const updateGuideStatusZodSchema = z.object({
    status: z.enum(Object.values(GUIDE_STATUS) as [string])
})