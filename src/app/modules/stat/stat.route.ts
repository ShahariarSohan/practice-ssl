import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { statControllers } from "./stat.controller";

const router = Router();

router.get("/user",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),statControllers.getUserStats)
router.get("/tour",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),statControllers.getTourStats)
router.get("/booking",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),statControllers.getBookingStats)
router.get("/payment",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),statControllers.getPaymentStats)

export const statRoutes = router;