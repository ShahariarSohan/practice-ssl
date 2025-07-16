/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/appError";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = `Something Went Wrong`;
    const errorSources: any = [];
    
    if (err.code === 11000) {
        statusCode = 400;
        const matchedArray = err.message.match(/email:\s*"([^"]+)"/);
        message=`${matchedArray[1]} already exits `
    }
    else if (err.name === "ValidationError") {
        statusCode = 400;
        const errors = Object.values(err.errors)
        errors.forEach((errorObject: any) => errorSources.push({
            path: errorObject.path,
            message:errorObject.message,
        }))
        message="Validation Error Occurred"
    }
    else if (err.name === "CastError") {
        statusCode = 400;
        message="Invalid MongoDB ObjectID, please provide a valid Id"
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error){
        statusCode = 500;
        message=err.message
    }
    res.status(statusCode).json({
        success: false,
        message,
        // err,
        errorSources,
        stack: envVars.NODE_ENV === "development" ? err.stack :null,
    })
    
}