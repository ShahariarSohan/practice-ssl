/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus from 'http-status-codes';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NextFunction, Request, Response } from 'express';
import { authServices } from './auth.service';

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   
        const loginInfo = await authServices.credentialsLogin(req.body)
        
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Logged In Successfully",
      data: loginInfo,
    });
  }
);

export const authControllers = {
    credentialsLogin
}