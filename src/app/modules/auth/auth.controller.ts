/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus from 'http-status-codes';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NextFunction, Request, Response } from 'express';
import { authServices } from './auth.service';
import AppError from '../../errorHelpers/appError';
import { setAuthCookie } from '../../utils/setCookie';
import { JwtPayload } from 'jsonwebtoken';
import { createUserTokens } from '../../utils/userTokens';
import { envVars } from '../../config/env';

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   
        const loginInfo = await authServices.credentialsLogin(req.body)
    
    setAuthCookie(res,loginInfo)
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Logged In Successfully",
      data: loginInfo,
    });
  }
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(httpStatus.BAD_REQUEST,"No refresh token received in cookies")
    }
        const tokenInfo = await authServices.getNewAccessToken(refreshToken)
        setAuthCookie(res,tokenInfo.accessToken)
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
      sameSite:"lax",
    })
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite:"lax",
    })
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User logged out Successfully",
      data: null,
    });
  }
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const decodedToken=req.user
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await authServices.resetPassword(oldPassword,newPassword,decodedToken as JwtPayload)
   
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
    
    const user = req.user
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND,"User not found")
    }
    const tokenInfo = createUserTokens(user)
    setAuthCookie(res,tokenInfo)
    console.log("Redirecting to:", envVars.FRONTEND_URL);
    res.redirect(envVars.FRONTEND_URL)
  }
);

export const authControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController
}