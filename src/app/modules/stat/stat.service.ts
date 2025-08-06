import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
  const totalUsersPromise = User.countDocuments();
  const totalActiveUsersPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const totalInActiveUsersPromise = User.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockedUsersPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });
  //  $gte ====>  Greater than or equal toEqual or later/future date
  //  $lte =====>   Less than or equal toEqual or earlier/past dates

  const newUsersInLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newUsersInLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });
  const totalUsersByRolePromise = User.aggregate([
    //by group
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);
  const [
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    toUsersByRole,
  ] = await Promise.all([
    totalUsersPromise,
    totalActiveUsersPromise,
    totalInActiveUsersPromise,
    totalBlockedUsersPromise,
    newUsersInLast7DaysPromise,
    newUsersInLast30DaysPromise,
    totalUsersByRolePromise,
  ]);

  return {
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    toUsersByRole,
  };
};
const getTourStats = async () => {
  const totalTourPromise = Tour.countDocuments();
  const totalTourTypesPromise = Tour.aggregate([
    //by lookup ------> to join collections
    {
      $lookup: {
        from: "tourtypes",
        localField: "tourType",
        foreignField: "_id",
        as: "tourTypes", // array field
      },
    },
    //   // unwind  ---->flattens an array field into individual objects
    {
      $unwind: "$tourTypes",
    },
    // //   group  ----> make unique group by given _id value
    {
      $group: {
        _id: "$tourTypes.name",
        count: { $sum: 1 },
      },
    },
  ]);
  const avgTourCostPromise = Tour.aggregate([
    {
      $group: {
        _id: null,
        avgCostFrom: { $avg: "$costFrom" },
      },
    },
  ]);
  const totalTourByDivisionPromise = Tour.aggregate([
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "division",
      },
    },
    {
      $unwind: "$division",
    },
    {
      $group: {
        _id: "$division.name",
        count: { $sum: 1 },
      },
    },
  ]);
  const totalBookingPromise = Booking.aggregate([
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    {
      $sort: { bookingCount: -1 },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "tours",
        let: { tourId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$tourId"] },
            },
          },
        ],
        as: "tour",
      },
    },
    {
      $unwind: "$tour",
    },
    {
      $project: {
        bookingCount: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
  ]);
  const [
    totalTours,
    totalTourTypes,
    avgTourCost,
    totalTourByDivision,
    totalBooking,
  ] = await Promise.all([
    totalTourPromise,
    totalTourTypesPromise,
    avgTourCostPromise,
    totalTourByDivisionPromise,
    totalBookingPromise,
  ]);

  return {
    totalTours,
    totalTourTypes,
    avgTourCost,
    totalTourByDivision,
    totalBooking,
  };
};
const getBookingStats = async () => {
  const totalBookingPromise = Booking.countDocuments();
  const totalBookingByStatusPromise = Booking.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  const bookingPerTourPromise = Booking.aggregate([
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    {
      $sort: {
        bookingCount: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "tours",
        localField: "_id",
        foreignField: "_id",
        as: "tour",
      },
    },
    {
      $unwind: "$tour",
    },

    {
      $project: {
        bookingCount: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
  ]);
  const avgBookingGuestCountPromise = Booking.aggregate([
    {
      $group: {
        _id: null,
        avgGuest: { $avg: "$guestCount" },
      },
    },
  ]);
  const bookingLast7DaysPromise = Booking.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const bookingLast30DaysPromise = Booking.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });
  const totalBookingByUniqueUserPromise = Booking.distinct("user").then(
    (user) => user.length
  );

  const [
    totalBooking,
    totalBookingByStatus,
    bookingPerTour,
    avgBookingGuestCount,
    bookingLast7Days,
    bookingLast30Days,
    totalBookingByUniqueUser,
  ] = await Promise.all([
    totalBookingPromise,
    totalBookingByStatusPromise,
    bookingPerTourPromise,
    avgBookingGuestCountPromise,
    bookingLast7DaysPromise,
    bookingLast30DaysPromise,
    totalBookingByUniqueUserPromise,
  ]);

  return {
    totalBooking,
    totalBookingByStatus,
    bookingPerTour,
    avgBookingGuestCount: avgBookingGuestCount[0].avgGuest,
    bookingLast7Days,
    bookingLast30Days,
    totalBookingByUniqueUser,
  };
};
const getPaymentStats = async () => {
  const totalPaymentPromise = Payment.countDocuments();
  const totalPaymentByStatusPromise = Payment.aggregate([
    {
      $group: {
       _id: "$status",
        count:{$sum:1}
      }
      
    }
  ])
  const totalRevenuePromise = Payment.aggregate([
    {
      $match: {
        status: PAYMENT_STATUS.PAID,
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    },
  ]);
  const averageAmountPromise = Payment.aggregate([
    {
      $group: {
        _id: null,
        avgAmount:{$avg:"$amount"}
      }
    }
  ])
  const paymentGatewayDataPromise = Payment.aggregate([
    {
      $group: {
        _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
        count:{$sum:1}
      }
    }
  ])
  const [
    totalPayment,
    totalRevenue,
    totalPaymentByStatus,
    averageAmount,
    paymentGatewayData,
  ] = await Promise.all([
    totalPaymentPromise,
    totalRevenuePromise,
    totalPaymentByStatusPromise,
    averageAmountPromise,
    paymentGatewayDataPromise,
  ]);

  return {
    totalPayment,
    totalPaymentByStatus,
    totalRevenue,
    averageAmount,
    paymentGatewayData,
  };
};
export const statServices = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats,
};
