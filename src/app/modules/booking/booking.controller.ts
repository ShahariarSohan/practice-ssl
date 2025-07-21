/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bookingServices } from './booking.service';
import { JwtPayload } from 'jsonwebtoken';

const createBooking = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const decodedToken = req.user as JwtPayload
    const user = await bookingServices.createBooking(req.body,decodedToken.id);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Booking created Successfully",
      data: user,
    });
  }
);

export const bookingControllers = {
    createBooking
}