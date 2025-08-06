import { Response } from "express";
import { envVars } from "../config/env";
interface IAuthTokens{
    accessToken?: string;
    refreshToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: IAuthTokens) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
          httpOnly: true,
          secure: envVars.DB_URL==="production",
          sameSite:"none"
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
          httpOnly: true,
          secure:envVars.DB_URL==="production",
          sameSite:"none"
        });
    }

}