import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";


const createDivision = async (payload: Partial<IDivision>) => {
    
    
    const isDivisionExist = await Division.findOne({name:payload.name});

    if (isDivisionExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "Division already exist");
    }
    const division = await Division.create(payload);
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
const getSingleDivision = async (slug: string) => {
    const division = await Division.findOne({ slug })
    return {
        data:division
    }
}

const updateDivision= async (id: string,payload:Partial<IDivision>) => {
    const isDivisionExist = await Division.findById(id)
    if (!isDivisionExist) {
        throw new AppError(httpStatus.BAD_REQUEST,"Division Doesn't Exist")
    }
    const duplicateDivision = await Division.findOne({
        name: payload.name,
        _id:{$ne:id}
    })
    if (duplicateDivision) {
        throw new AppError(httpStatus.BAD_REQUEST,"A Division with this name already exist")
    }
   
    const updatedDivision = await Division.findByIdAndUpdate(id, payload, { new: true,runValidators:true });
    return updatedDivision;
}
const deleteDivision = async (id: string) => {

    const isDivisionExist = await Division.findById(id);
    if (!isDivisionExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "Division Doesn't Exist");
    }
    await Division.findByIdAndDelete(id);
    return null
}
export const divisionServices = {
    createDivision,
    getAllDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision
};
