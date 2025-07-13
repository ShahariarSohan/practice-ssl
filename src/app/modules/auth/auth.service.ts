import bcrypt  from 'bcryptjs';
import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import { createNewAccessTokenWithRefreshToken, createUserTokens } from '../../utils/userTokens';
import { IUser } from '../user/user.interface';




    
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
   const newAccessToken=await createNewAccessTokenWithRefreshToken(refreshToken)
   
    return {
       accessToken:newAccessToken
    }
    
}

export const authServices = {
    credentialsLogin,
    getNewAccessToken
}

