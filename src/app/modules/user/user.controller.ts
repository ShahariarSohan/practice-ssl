
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";




const createUser = catchAsync(async (req: Request, res: Response,next:NextFunction) => {

    
  const user=await userServices.createUser(req.body)
   
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
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
   
    const verifiedToken = req.user;

    const updatedUser = await userServices.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User updated Successfully",
      data: updatedUser,
    });
  }
);
export const userControllers = {
  createUser,
  getAllUser,
  updateUser
}