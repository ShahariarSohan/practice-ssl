/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { divisionServices } from "./division.service";
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { NextFunction, Request, Response } from 'express';

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await divisionServices.createDivision(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Division created Successfully",
      data: user,
    });
  }
);
const getAllDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await divisionServices.getAllDivision()

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Divisions Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
export const  divisionControllers = {
    createDivision,
    getAllDivision
}