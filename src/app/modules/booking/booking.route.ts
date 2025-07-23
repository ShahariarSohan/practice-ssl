import { checkAuth } from './../../middlewares/checkAuth';
import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema, updateBookingZodSchema } from "./booking.validation";
import { Role } from '../user/user.interface';

const router = Router()

router.post("/create",checkAuth(...Object.values(Role)),validateRequest(createBookingZodSchema),bookingControllers.createBooking)
router.get("/",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),bookingControllers.getAllBooking)
router.get(
  "/myBooking",
  checkAuth(...Object.values(Role)),
  bookingControllers.getMyBooking
);
router.get(
  "/:bookingId",
  checkAuth(...Object.values(Role)),
  bookingControllers.getSingleBooking
);
router.patch(
  "/:bookingId/status",
  checkAuth(...Object.values(Role)),
  validateRequest(updateBookingZodSchema),
  bookingControllers.updateBookingStatus
);
export const bookingRoutes = router;