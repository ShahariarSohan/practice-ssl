
import bcrypt  from 'bcryptjs';
import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import { generateToken } from '../../utils/jwt';
import { envVars } from '../../config/env';


    
    
const credentialsLogin = async (payload: Partial<IUser>) => { 
    const { email, password } = payload;
    const isUserExist = await User.findOne({ email })
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST,"Email doesn't exist")
    }
    const isPasswordMatched=await bcrypt.compare(password as string,isUserExist.password as string)
    if (!isPasswordMatched) {
         throw new AppError(httpStatus.BAD_REQUEST, "Password doesn't exist");
    }
    const jwtPayload = {
        id:isUserExist._id,
        email: isUserExist.email,
        role:isUserExist.role,
    }
    const accessToken=generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)
    return {
       accessToken
    }
}

export const authServices = {
    credentialsLogin
}

