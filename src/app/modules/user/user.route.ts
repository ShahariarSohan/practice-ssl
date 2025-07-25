import { userControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { multerUpload } from "../../config/multer.config";

const router = Router();
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userControllers.getAllUser
);
router.post(
  "/register",
  multerUpload.single("file"),
  validateRequest(createUserZodSchema),
  userControllers.createUser
);
router.get(
  "/:id",
  checkAuth(...Object.values(Role)),
  userControllers.getSingleUser
);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  multerUpload.single("file"),
  validateRequest(updateUserZodSchema),

  userControllers.updateUser
);

export const userRoutes = router;
