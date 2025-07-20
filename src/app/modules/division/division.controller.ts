/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { divisionServices } from "./division.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const division = await divisionServices.createDivision(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Division created Successfully",
      data: division,
    });
  }
);
const getAllDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await divisionServices.getAllDivision(req.query as Record<string,string>);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Divisions Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
const getSingleDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const result = await divisionServices.getSingleDivision(slug);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Division Retrieved Successfully",
      data: result.data,
    });
  }
);
const updateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await divisionServices.updateDivision(id,req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Division Updated Successfully",
      data: result,
    });
  }
);

const deleteDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await divisionServices.deleteDivision(id);

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Division deleted Successfully",
      data:result
    });
  }
);
export const divisionControllers = {
  createDivision,
  getAllDivision,
  getSingleDivision,
  updateDivision,
  deleteDivision
};
