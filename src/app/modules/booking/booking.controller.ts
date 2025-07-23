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
const getAllBooking = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        
    const result = await bookingServices.getAllBooking(req.query as Record<string,string> )
    
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Booking retrieved Successfully",
      data: result.data,
      meta:result.meta,
    });
  }
);
const getMyBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken=req.user as JwtPayload
    const result =await bookingServices.getMyBooking(decodedToken.id);

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "My Booking retrieved  Successfully",
      data: result,
    });
  }
);
const getSingleBooking = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
       const bookingId=req.params.bookingId
       const result=await bookingServices.getSingleBooking(bookingId)
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Booking retrieved Successfully",
      data: result,
    });
  }
);
const updateBookingStatus = catchAsync(
    async (req: Request, res: Response,next:NextFunction) => {
    const bookingId = req.params.bookingId;
 const result =await  bookingServices.updateBookingStatus(bookingId,req.body)
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Booking Status Updated Successfully",
      data: result,
    });
  }
);


export const bookingControllers = {
  createBooking,
  getAllBooking,
  getMyBooking,
  getSingleBooking,
  updateBookingStatus,
}