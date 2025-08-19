import httpStatus from "http-status-codes";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { paymentServices } from "./payment.service";
import { envVars } from "../../config/env";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";



const getAllPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentServices.getAllPayment(
      req.query as Record<string, string>
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Payment Retrieved Successful",
      data: result.data,
      meta: result.meta,
    });
  }
);
const getSinglePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = req.params.transactionId;
    const result = await paymentServices.getSinglePayment(transactionId);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Payment Retrieved Successful",
      data: result,
    });
  }
);
const getInvoiceDownloadUrl = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const  paymentId  = req.params.paymentId;
    const result = await paymentServices.getInvoiceDownloadUrl(
      paymentId,
      decodedToken.id
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Payment Retrieved Successful",
      data: result,
    });
  }
);


export const paymentControllers = {
  
  getAllPayment,
  getSinglePayment,
  getInvoiceDownloadUrl,
 
};
