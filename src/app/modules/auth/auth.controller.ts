/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus from 'http-status-codes';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NextFunction, Request, Response } from 'express';
import { authServices } from './auth.service';
import AppError from '../../errorHelpers/appError';
import { setAuthCookie } from '../../utils/setCookie';

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

export const authControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout
}