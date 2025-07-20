import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { divisionSearchAbleFields } from "./division.constant";

const createDivision = async (payload: Partial<IDivision>) => {
  const isDivisionExist = await Division.findOne({ name: payload.name });

  if (isDivisionExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Division already exist");
  }
  const division = await Division.create(payload);
  return division;
};
const getAllDivision = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Division.find(), query);
  const divisions = await queryBuilder
    .search(divisionSearchAbleFields)
    .filter()
    .sort()
    .fields()
    .paginate()
        .build();
    
    const meta=await queryBuilder.getMeta()
    return {
        data: divisions,
        meta:meta
    }
};
const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });
  if (!division) {
    throw new AppError(httpStatus.BAD_REQUEST, "Division doesn't Exist");
  }
  return {
    data: division,
  };
};

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const isDivisionExist = await Division.findById(id);
  if (!isDivisionExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Division Doesn't Exist");
  }
  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });
  if (duplicateDivision) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A Division with this name already exist"
    );
  }

  const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updatedDivision;
};
const deleteDivision = async (id: string) => {
  const isDivisionExist = await Division.findById(id);
  if (!isDivisionExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Division Doesn't Exist");
  }
  await Division.findByIdAndDelete(id);
  return null;
};
export const divisionServices = {
  createDivision,
  getAllDivision,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
