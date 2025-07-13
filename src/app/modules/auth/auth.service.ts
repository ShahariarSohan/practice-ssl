import bcrypt  from 'bcryptjs';
import AppError from "../../errorHelpers/appError";
import { IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import { createUserTokens } from '../../utils/userTokens';
import { generateToken, verifyToken } from '../../utils/jwt';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';

    
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
    const userTokens=createUserTokens(isUserExist)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject();
    return {
        accessToken:userTokens.accessToken,
        refreshToken:userTokens.refreshToken,
        user:rest
    }
    
}
const getNewAccessToken = async (refreshToken:string) => { 
    const verifiedRefreshToken=verifyToken(refreshToken,envVars.JWT_REFRESH_SECRET) as JwtPayload
    const isUserExist = await User.findOne({ email:verifiedRefreshToken.email })
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST,"User doesn't exist")
    }
    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST,`User is ${isUserExist.isActive}`)
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST,`User is deleted`)
    }
    
    const jwtPayload = {
         id: isUserExist._id,
         email: isUserExist.email,
         role: isUserExist.role,
       };
       const accessToken = generateToken(
         jwtPayload,
         envVars.JWT_ACCESS_SECRET,
         envVars.JWT_ACCESS_EXPIRES
       );
   
    return {
       accessToken
    }
    
}

export const authServices = {
    credentialsLogin,
    getNewAccessToken
}

