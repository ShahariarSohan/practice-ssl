import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middlewares/validateRequest";
import { guideApplyZodSchema, updateGuideStatusZodSchema } from "./guide.validation";
import { guideControllers } from "./guide.controller";

const router = Router();

router.post("/apply", checkAuth(Role.USER), multerUpload.single("file"), validateRequest(guideApplyZodSchema), guideControllers.applyForGuide);
router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), guideControllers.getAllGuideApplication)
router.get("/:id",checkAuth(...Object.values(Role)),guideControllers.getSingleGuideApplication)
router.patch("/approve/:id",checkAuth(Role.SUPER_ADMIN,Role.ADMIN),validateRequest(updateGuideStatusZodSchema),guideControllers.updateGuideStatus)
export const guideRoutes = router;
