/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { otpServices } from "./otp.service";

const sendOTP = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, name } = req.body;
        await otpServices.sendOTP(email,name)
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "OTP send Successfully",
      data: null,
    });
  }
);
const verifyOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    await otpServices.verifyOTP(email,otp)
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "OTP verified Successfully",
      data: null,
    });
  }
);
export const otpControllers = {
  sendOTP,
  verifyOTP,
};
