/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { IGuide } from "./guide.interface";
import { guideServices } from "./guide.service";

const applyForGuide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const payload: IGuide = {
      user: decodedToken.id,
      nidPhoto: req.file?.path as string,
      ...req.body,
    };
    const result = await guideServices.applyForGuide(payload);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: " You have Successfully Applied For Guide",
      data: result,
    });
  }
);

const updateGuideStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await guideServices.updateGuideStatus(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: " Status Changed Successfully",
      data: result,
    });
  }
);
const getAllGuideApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await guideServices.getAllGuideApplication(
      req.query as Record<string, string>
    );
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: " Guides Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
const getSingleGuideApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id=req.params.id
    const result = await guideServices.getSingleGuideApplication(id)
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: " Guide Retrieved Successfully",
      data:result
    });
  }
);
export const guideControllers = {
  applyForGuide,
  updateGuideStatus,
  getAllGuideApplication,
  getSingleGuideApplication,
};
