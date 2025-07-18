/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { tourServices } from "./tour.service";

const createTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await tourServices.createTourType(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Tour Type created Successfully",
      data: result,
    });
  }
);
const getAllTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await tourServices.getAllTourType();

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Tour Type Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
 
  const result = await tourServices.updateTourType(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.ACCEPTED,
    success: true,
    message: "Tour type updated successfully",
    data: result,
  });
});
const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await tourServices.deleteTourType(id);
  sendResponse(res, {
    statusCode: httpStatus.ACCEPTED,
    success: true,
    message: "Tour type deleted successfully",
    data: result,
  });
});
export const tourControllers = {
  createTourType,
    getAllTourType,
    updateTourType,
  deleteTourType
};
