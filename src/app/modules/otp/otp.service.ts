import  httpStatus  from 'http-status-codes';
import { redisClient } from "../../config/redis.config";
import AppError from "../../errorHelpers/appError";
import { generateOtp } from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";
import { User } from '../user/user.model';

const sendOTP = async (email: string, name: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,"User not found")
  }
  if (user.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST,"User already verified")
  }
  const otp = generateOtp();
  const redisKey = `otp:${email}`;
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: 2 * 60,
    },
  });
    await sendEmail({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp:otp
        }
    })
};
const verifyOTP = async (email: string, otp: string) => {
   const user = await User.findOne({ email });
   if (!user) {
     throw new AppError(httpStatus.NOT_FOUND, "User not found");
   }
   if (user.isVerified) {
     throw new AppError(httpStatus.BAD_REQUEST, "User already verified");
   }
  const redisKey = `otp:${email}`
  const savedOtp=await redisClient.get(redisKey)
  if (!savedOtp) {
    throw new AppError(httpStatus.BAD_REQUEST,"Invalid OTP")
  }
  if (savedOtp!==otp) {
    throw new AppError(httpStatus.BAD_REQUEST,"Invalid OTP")
  }
  await Promise.all([
    User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
    redisClient.del([redisKey])
  ])
};

export const otpServices = {
  sendOTP,
  verifyOTP,
};
