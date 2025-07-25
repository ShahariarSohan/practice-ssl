/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";

import AppError from "../../errorHelpers/appError";

import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLServices } from "../sslCommerz/sslCommerz.sevice";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { paymentSearchableFields } from "./payment.constant";
import { BOOKING_STATUS } from "../booking/booking.interface";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment doesn't exist");
  }
  const booking = await Booking.findById(payment.booking);
  const userName = (booking?.user as any).name;
  const userEmail = (booking?.user as any).email;
  const userPhoneNumber = (booking?.user as any).phone;
  const userAddress = (booking?.user as any).address;
  const sslPayload: ISSLCommerz = {
    amount: payment.amount,
    transactionId: payment.transactionId,
    name: userName,
    email: userEmail,
    phoneNumber: userPhoneNumber,
    address: userAddress,
  };
  const sslPayment = await SSLServices.sslPaymentInit(sslPayload);
  return {
    paymentURL: sslPayment.GatewayPageURL,
  };
};
const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.PAID,
      },
      { runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status:BOOKING_STATUS.COMPLETE },
      { runValidators: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return {
      success: true,
      message: "Payment completed successfully",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const failPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { runValidators: true, session }
    );
    await Booking.findByIdAndUpdate(updatedPayment?.booking, {
      status: BOOKING_STATUS.FAILED,
    });
    await session.commitTransaction();
    session.endSession();
    return {
      success: false,
      message: "Payment Failed",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.CANCELLED },
      { runValidators: true, session }
    );
    await Booking.findByIdAndUpdate(updatedPayment?.booking, {
      status: BOOKING_STATUS.CANCEL,
    });
    await session.commitTransaction();
    session.endSession();
    return {
      success: false,
      message: "Payment Cancelled",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const getAllPayment = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Payment.find(), query);
  const payments = await queryBuilder
    .search(paymentSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .build();
  const meta = await queryBuilder.getMeta()
  return {
    data: payments,
    meta:meta
  }
};
const getSinglePayment = async (transactionId: string) => {
  const payment = await Payment.findOne({ transactionId: transactionId })
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND,"Payment not found")
  }
  return payment
}
export const paymentServices = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
  getAllPayment,
  getSinglePayment
};
