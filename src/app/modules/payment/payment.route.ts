import { Router } from "express";
import { paymentControllers } from "./payment.controller";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router() 

router.get("/",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),paymentControllers.getAllPayment)
router.get("/:transactionId",checkAuth(...Object.values(Role)),paymentControllers.getSinglePayment)
router.get("/invoice/:paymentId",checkAuth(...Object.values(Role)),paymentControllers.getInvoiceDownloadUrl)

export const paymentRoutes=router

