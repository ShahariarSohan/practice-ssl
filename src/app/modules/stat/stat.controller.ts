/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { statServices } from "./stat.service";

const getUserStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statServices.getUserStats();

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "User stats Retrieved Successfully",
      data: result,
    });
  }
);
const getTourStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statServices.getTourStats();

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Tour stats Retrieved Successfully",
      data: result,
    });
  }
);
const getBookingStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statServices.getBookingStats();

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Booking stats Retrieved Successfully",
      data: result,
    });
  }
);
const getPaymentStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await statServices.getPaymentStats();

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Payment stats Retrieved Successfully",
      data: result,
    });
  }
);
export const statControllers = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats,
};
