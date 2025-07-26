/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import { authServices } from "./auth.service";
import AppError from "../../errorHelpers/appError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import passport from "passport";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await authServices.credentialsLogin(req.body)
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new AppError(httpStatus.BAD_REQUEST, info.message));
      }
      const userTokens = await createUserTokens(user);
      const { password, ...rest } = user.toObject();
      setAuthCookie(res, userTokens);
      sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Logged In Successfully",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
  }
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token received in cookies"
      );
    }
    const tokenInfo = await authServices.getNewAccessToken(refreshToken);
    setAuthCookie(res, tokenInfo.accessToken);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "New access token retrieved  Successfully",
      data: tokenInfo,
    });
  }
);
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User logged out Successfully",
      data: null,
    });
  }
);
const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await authServices.changePassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);
const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    console.log(decodedToken);
    const { password } = req.body;
    await authServices.setPassword(decodedToken.id, password);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Set Password Successfully",
      data: null,
    });
  }
);
const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await authServices.forgetPassword(email)
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Email sent Successfully",
      data: null,
    });
  }
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken=req.user as JwtPayload
    await authServices.resetPassword(req.body,decodedToken)
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Password updated Successfully",
      data: null,
    });
  }
);

const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    const tokenInfo = createUserTokens(user);
    setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const authControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  changePassword,
  setPassword,
  forgetPassword,
  resetPassword,
  googleCallbackController,
};
