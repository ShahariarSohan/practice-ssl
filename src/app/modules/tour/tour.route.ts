import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { createTourTypeZodSchema } from "./tour.validation";
import { tourControllers } from "./tour.controller";

const router = Router()
//// tour types Api //////
router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  tourControllers.createTourType
);
router.get("/tour-types", tourControllers.getAllTourType)
router.patch(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  tourControllers.updateTourType
);
router.delete(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourControllers.deleteTourType
);

//// tour Api ///////


export const tourRoutes = router;