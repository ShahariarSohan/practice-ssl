import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";


const createDivision = async (payload: Partial<IDivision>) => {
    const { name, ...rest } = payload;
    const isDivisionExist = await Division.findOne({name});

    if (isDivisionExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "Division already exist");
    }

    const division = await Division.create({
      name,
      ...rest,
    });
    return division;
};
const getAllDivision = async () => {
    const divisions = await Division.find({})
    const totalDivisions = await Division.countDocuments()
    return {
        data: divisions,
        meta: {
            total:totalDivisions
        }
    }
}
 
export const divisionServices = {
    createDivision,
    getAllDivision
};
