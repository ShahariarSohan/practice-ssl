import mongoose from "mongoose";
import { IErrorResponse } from "../interfaces/errorTypes";

export const handleCastError = (
  err: mongoose.Error.CastError
): IErrorResponse => {
    console.log(err)
  return {
    statusCode: 400,
    message: "Invalid MongoDB ObjectID, please provide a valid Id",
  };
};
