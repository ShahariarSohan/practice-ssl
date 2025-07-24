import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validate";
import { divisionControllers } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.get("/", divisionControllers.getAllDivision);
router.post(
  "/create",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  multerUpload.single("file"),
  validateRequest(createDivisionZodSchema),
  divisionControllers.createDivision
);
router.get("/:slug", divisionControllers.getSingleDivision);
router.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(updateDivisionZodSchema),
  divisionControllers.updateDivision
);
router.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  divisionControllers.deleteDivision
);
export const divisionRoutes = router;
