import  httpStatus  from 'http-status-codes';
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVars } from '../../config/env';
const createUser =async (payload: Partial<IUser>) => {
    const {  email,password,...rest } = payload;

  const isUserExist = await User.findOne({ email })

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST,"User Already Exist")
  }
  const hashPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }
  
  
    const user = await User.create({
      
      email,
      password:hashPassword,
      auths:[authProvider],
      ...rest
    });
    return user;
}

const getAllUser = async () => {
  const users = await User.find({})
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total:totalUsers
    }
  }
}
export const userServices = {
  createUser,
  getAllUser
}