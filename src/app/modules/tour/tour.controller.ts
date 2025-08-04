
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { tourServices } from "./tour.service";
import { ITour } from "./tour.interface";
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
    const result = await tourServices.getAllTourType(req.query as Record<string,string>);

    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Tour Type Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
const getSingleTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await tourServices.getSingleTourType(id);
  sendResponse(res, {
    statusCode: httpStatus.ACCEPTED,
    success: true,
    message: "Tour Type Retrieved successfully",
    data: result,
  });
});
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
/// tour controller
const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   
    const payload: ITour = {
      ...req.body,
      images:(req.files as Express.Multer.File[])?.map(file=>file.path)
    }
    const result = await tourServices.createTour(payload);
    
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Tour created Successfully",
      data: result,
    });
  }
);
const getAllTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await tourServices.getAllTour(req.query as Record<string,string>);
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Tours  Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
const getSingleTour = catchAsync(async (req: Request, res: Response) => {
  const  slug  = req.params.slug;
  const result = await tourServices.getSingleTour(slug);
  sendResponse(res, {
    statusCode: httpStatus.ACCEPTED,
    success: true,
    message: "Tour Retrieved successfully",
    data: result,
  });
});
const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload: ITour = {
      ...req.body,
      images:(req.files as Express.Multer.File[]).map(file=>file.path)
   }
    const result = await tourServices.updateTour(id,payload);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Tour updated Successfully",
      data: result,
    });
  }
);
const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await tourServices.deleteTour(id);
  sendResponse(res, {
    statusCode: httpStatus.ACCEPTED,
    success: true,
    message: "Tour deleted successfully",
    data: result,
  });
});
export const tourControllers = {
  createTourType,
  getAllTourType,
  getSingleTourType,
  updateTourType,
  deleteTourType,
  createTour,
  getAllTour,
  getSingleTour,
  updateTour,
  deleteTour,
};
