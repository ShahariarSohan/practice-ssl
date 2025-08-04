import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { IGuide } from "./guide.interface";
import { Guide } from "./guide.model";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { guideSearchAbleFields } from "./guide.constant";

const applyForGuide = async (payload: IGuide) => {
  const isGuideApplyExist = await Guide.findOne({ user: payload.user });
  if (isGuideApplyExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have already applied");
  }
  const guide = await Guide.create(payload);
  return guide;
};
const updateGuideStatus = async (id: string, payload: Partial<IGuide>) => {
  const isGuideExist = await Guide.findById(id);
  if (!isGuideExist) {
    throw new AppError(httpStatus.NOT_FOUND, "No one applied");
  }
  if (
    isGuideExist.status === "APPROVED" ||
    isGuideExist.status === "REJECTED"
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User already ${isGuideExist.status} for guide role`
    );
  }
  const updatedGuide = await Guide.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  const user = await User.findById(isGuideExist.user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist");
  }
  if (payload.status === "APPROVED") {
    user.role = Role.GUIDE;
    await user.save();
  }
  return updatedGuide;
};
const getAllGuideApplication = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Guide.find(), query);
  //.populate("user", "name email").populate("division","name")
  const guides = await queryBuilder
    .search(guideSearchAbleFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .build();
  const meta = await queryBuilder.getMeta();
  return {
    data: guides,
    meta: meta,
  };
};
const getSingleGuideApplication = async (id:string) => {
  const isGuideApplyExist = await Guide.findById(id);
  if (!isGuideApplyExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Guide Application Doesn't Exist");
  }
  return isGuideApplyExist;
};
export const guideServices = {
  applyForGuide,
  updateGuideStatus,
  getAllGuideApplication,
  getSingleGuideApplication,
};
