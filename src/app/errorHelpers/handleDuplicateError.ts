import mongoose from "mongoose";
import { IErrorResponse } from "../interfaces/errorTypes";

export const handleDuplicateError = (err:mongoose.Error.CastError):IErrorResponse => {
    const matchedArray = err.message.match(/email:\s*"([^"]+)"/);
    return {
      statusCode: 400,
      message: `${matchedArray?.[1]} already exits `,
    };
};
