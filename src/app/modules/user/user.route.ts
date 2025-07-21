import { userControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userControllers.getAllUser
);
router.get(
  "/:id",
  checkAuth(...Object.values(Role)),
  userControllers.getSingleUser
);

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  userControllers.updateUser
);

export const userRoutes = router;
