import { Router } from "express";
import { userControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.post("/register",validateRequest(createUserZodSchema), userControllers.createUser);
router.get("/", userControllers.getAllUser);

export const userRoutes = router;
