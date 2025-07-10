/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";



const createUser = catchAsync(async (req: Request, res: Response,next:NextFunction) => {

    
  const user=await userServices.createUser(req.body)
    // res.status(httpStatus.CREATED).json({
    //     message: "User created Successfully",
    //     user
    // })
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created Successfully",
      data: user,
    });
})

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.getAllUser();
    
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Users Retrieved Successfully",
      data: result.data,
      meta:result.meta,
   })
  }
);
export const userControllers = {
  createUser,
  getAllUser
}