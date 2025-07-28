import { NextFunction, Request, Response, Router } from "express";
import { authControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";


const router = Router();
router.post("/login",authControllers.credentialsLogin)
router.post("/refresh-token", authControllers.getNewAccessToken)
router.post("/logout", authControllers.logout)
router.post("/change-password", checkAuth(...Object.values(Role)), authControllers.changePassword)
router.post("/set-password", checkAuth(...Object.values(Role)), authControllers.setPassword)
router.post("/forget-password", authControllers.forgetPassword)
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  authControllers.resetPassword
);
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect=req.query.redirect ||"/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})
router.get("/google/callback",passport.authenticate("google",{failureRedirect:`${envVars.FRONTEND_URL}/login?error= Issue in your account.Please contact with Support`}),authControllers.googleCallbackController)
export const authRoutes = router;