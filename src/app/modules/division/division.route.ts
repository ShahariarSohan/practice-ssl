import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validate";
import { divisionControllers } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(createDivisionZodSchema),
  divisionControllers.createDivision
);
router.get("/", divisionControllers.getAllDivision);
router.get("/:slug", divisionControllers.getSingleDivision);
router.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(updateDivisionZodSchema),
  divisionControllers.updateDivision
);
router.delete("/:id", checkAuth(Role.SUPER_ADMIN, Role.ADMIN),divisionControllers.deleteDivision);
export const divisionRoutes = router;
