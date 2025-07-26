/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";

import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import AppError from "../../errorHelpers/appError";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { SSLServices } from "../sslCommerz/sslCommerz.sevice";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { bookingSearchableFields } from "./booking.constant";
import { getTransactionId } from "../../utils/getTransactionId";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();

  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId);

    if (!user?.phone || !user?.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please update your profile to book a tour"
      );
    }

    const tour = await Tour.findById(payload.tour).select("costFrom");
    if (!tour?.costFrom) {
      throw new AppError(httpStatus.BAD_REQUEST, "costFrom doesn't found");
    }
    const amount = Number(payload.guestCount) * Number(tour.costFrom);
    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );
    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId: transactionId,
          amount: amount,
        },
      ],
      { session }
    );
    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");
    const userName = (updatedBooking?.user as any).name;
    const userEmail = (updatedBooking?.user as any).email;
    const userPhoneNumber = (updatedBooking?.user as any).phone;
    const userAddress = (updatedBooking?.user as any).address;
    const sslPayload: ISSLCommerz = {
      amount: amount,
      transactionId: transactionId,
      name: userName,
      email: userEmail,
      phoneNumber: userPhoneNumber,
      address: userAddress,
    };
    const sslPayment = await SSLServices.sslPaymentInit(sslPayload);
    
    await session.commitTransaction(); // Transaction Succeed
    session.endSession();
    return {
      paymentURL: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
  } catch (error) {
    await session.abortTransaction(); // Rollback
    session.endSession();
    throw error;
  }
};
const getAllBooking = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Booking.find(), query);
  const bookings = await queryBuilder
    .search(bookingSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .build();
  const meta = await queryBuilder.getMeta();
  return {
    data: bookings,
    meta:meta,
    
  };
};
const getMyBooking = async (userId:string) => {
  const booking = await Booking.findOne({user:userId})
 if (!booking) {
   throw new AppError(httpStatus.NOT_FOUND, "Booking Not Found");
  }
  return booking;
};
const getSingleBooking = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId)
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND,"Booking Not Found")
  }
  return booking
}
const updateBookingStatus = async (bookingId: string,payload:Partial<IBooking>) => {
 const booking = await Booking.findById(bookingId);
 if (!booking) {
   throw new AppError(httpStatus.NOT_FOUND, "Booking Not Found");
  }
  
  const updatedBooking = await Booking.findByIdAndUpdate(bookingId,payload ,{ new: true, runValidators: true })
  return updatedBooking;
}

export const bookingServices = {
  createBooking,
  getAllBooking,
  getMyBooking,
  getSingleBooking,
  updateBookingStatus
};
