/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface";

import { envVars } from "../../config/env";
import { sendEmail } from "../../utils/sendEmail";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email doesn't exist");
  }
  const isPasswordMatched = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password doesn't exist");
  }
  const userTokens = createUserTokens(isUserExist);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject();
  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};
const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.id);
  const isPasswordMatched = await bcrypt.compare(
    oldPassword,
    user!.password as string
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password doesn't match");
  }
  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user!.save();
  return true;
};
const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already set a password ,If you want to change password go to your profile"
    );
  }
  const hashPassword = await bcrypt.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };
  const auths: IAuthProvider[] = [...user.auths, credentialProvider];
  user.password = hashPassword;
  user.auths = auths;
  await user.save();
};
const forgetPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email: email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist");
  }
  if (!isUserExist.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${isUserExist.isActive}`
    );
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, `User is deleted`);
  }
  const jwtPayload = {
    id: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });
  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });
};
const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id !== decodedToken.id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You will not able to reset password"
    );
  }
  const isUserExist = await User.findById(decodedToken.id);
  if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, "User doesn't Exist");     
    }
    const hashPassword = await bcrypt.hash(payload.newPassword, Number(envVars.BCRYPT_SALT_ROUND))
    isUserExist.password = hashPassword;
    await isUserExist.save()
};

export const authServices = {
  credentialsLogin,
  getNewAccessToken,
  changePassword,
  setPassword,
  forgetPassword,
  resetPassword,
};
