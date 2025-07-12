
import { userControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";


const router = Router();


router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);
router.get(
  "/",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
  userControllers.getAllUser
);

export const userRoutes = router;
