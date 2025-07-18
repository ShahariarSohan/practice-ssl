import  httpStatus  from 'http-status-codes';
import AppError from "../../errorHelpers/appError";
import { ITourType } from "./tour.interface";
import { TourType } from "./tour.model";

const createTourType = async (payload: ITourType) => {
    const isTourType = await TourType.findOne({ name: payload.name })
    
    if (isTourType) {
        throw new AppError(httpStatus.BAD_REQUEST,"Tour Type already exist")
    }
    const tourType = await TourType.create(payload)
    
    return tourType;
}
const getAllTourType = async () => {
    const tourTypes = await TourType.find({})
    const totalTours=await TourType.countDocuments()
    return {
        meta: {
            total:totalTours
        },
        data:tourTypes
    }
}
const updateTourType= async (id: string, payload: ITourType) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new AppError(httpStatus.BAD_REQUEST,"Tour Type doesn't Exist")
    }
    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true,runValidators:true });
    return updatedTourType;
};

const deleteTourType = async (id: string) => {
    const isTourTypeExist = await TourType.findById(id)
   
        if (!isTourTypeExist) {
          throw new AppError(httpStatus.BAD_REQUEST, "Tour Type doesn't Exist");
        }
    await TourType.findByIdAndDelete(id)
    return null;
}
export const tourServices = {
    createTourType,
    getAllTourType,
    updateTourType,
    deleteTourType
}