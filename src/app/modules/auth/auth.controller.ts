/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus from 'http-status-codes';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NextFunction, Request, Response } from 'express';
import { authServices } from './auth.service';
import AppError from '../../errorHelpers/appError';

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   
        const loginInfo = await authServices.credentialsLogin(req.body)
    res.cookie("refreshToken", loginInfo.refreshToken, {
          httpOnly:true,
          secure:false
    })
    res.cookie("accessToken", loginInfo.accessToken, {
      httpOnly: true,
      secure:false
    })
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
        
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Logged In Successfully",
      data: tokenInfo,
    });
  }
);

export const authControllers = {
  credentialsLogin,
  getNewAccessToken
}