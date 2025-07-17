import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionZodSchema } from "./division.validate";
import { divisionControllers } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()

router.post("/create", validateRequest(createDivisionZodSchema), divisionControllers.createDivision)
router.get("/",checkAuth(Role.SUPER_ADMIN,Role.ADMIN),divisionControllers.getAllDivision)

export const divisionRoutes = router;