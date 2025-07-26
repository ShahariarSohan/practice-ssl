import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchAbleFields } from "./user.constant";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }
  const hashPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const getAllUser = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const users = await queryBuilder
    .search(userSearchAbleFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .build();
  const meta = await queryBuilder.getMeta();
  return {
    data: users,
    meta: meta,
  };
};
const getMe = async (id: string) => {
  const isUserExist = await User.findById(id).select("-password");
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist");
  }

  return isUserExist;
};
const getSingleUser = async (user: JwtPayload, id: string) => {
  const isUserExist = await User.findById(id).select("-password");
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist");
  }

  if ((user.role === Role.USER || user.role === Role.GUIDE) && user.id !== id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are only authorized to see your own data"
    );
  }

  return isUserExist;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User does't exist");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "Your are not authorized");
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "Your are not authorized");
    }
  }
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "Your are not authorized");
    }
  }
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }
  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  if (payload.picture && isUserExist.picture) {
    await deleteImageFromCloudinary(isUserExist.picture);
  }
  return newUpdatedUser;
};
export const userServices = {
  createUser,
  getAllUser,
  getMe,
  getSingleUser,
  updateUser,
};
