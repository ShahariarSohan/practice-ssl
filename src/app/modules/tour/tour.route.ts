import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { createTourTypeZodSchema, createTourZodSchema, updateTourTypeZodSchema, updateTourZodSchema } from "./tour.validation";
import { tourControllers } from "./tour.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router()
//// tour types Api //////
router.get("/tour-types", tourControllers.getAllTourType);
router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  tourControllers.createTourType
);

router.get("/tour-types/:id",tourControllers.getSingleTourType)
router.patch(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateTourTypeZodSchema),
  tourControllers.updateTourType
);
router.delete(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourControllers.deleteTourType
);

//// tour Api ///////
router.get("/", tourControllers.getAllTour);
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(createTourZodSchema),
  tourControllers.createTour
);
router.get("/:slug",tourControllers.getSingleTour)
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(updateTourZodSchema),
  tourControllers.updateTour
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourControllers.deleteTour
);
export const tourRoutes = router;