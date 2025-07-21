import { checkAuth } from './../../middlewares/checkAuth';
import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema } from "./booking.validation";
import { Role } from '../user/user.interface';

const router = Router()

router.post("/create",checkAuth(...Object.values(Role)),validateRequest(createBookingZodSchema),bookingControllers.createBooking)

export const bookingRoutes = router;