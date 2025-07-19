import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { tourSearchAbleFields } from "./tour.constant";
///tour type services
const createTourType = async (payload: ITourType) => {
  const isTourType = await TourType.findOne({ name: payload.name });

  if (isTourType) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour Type already exist");
  }
  const tourType = await TourType.create(payload);

  return tourType;
};
const getAllTourType = async () => {
  const tourTypes = await TourType.find({});
  const totalTours = await TourType.countDocuments();
  return {
    meta: {
      total: totalTours,
    },
    data: tourTypes,
  };
};
const updateTourType = async (id: string, payload: ITourType) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour Type doesn't Exist");
  }
  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updatedTourType;
};

const deleteTourType = async (id: string) => {
  const isTourTypeExist = await TourType.findById(id);

  if (!isTourTypeExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour Type doesn't Exist");
  }
  await TourType.findByIdAndDelete(id);
  return null;
};

/// Tour services
const createTour = async (payload: Partial<ITour>) => {
  const isTourExist = await Tour.findOne({ title: payload.title });
  if (isTourExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour Already Exist");
  }
  const baseSlug = payload.title?.toLocaleLowerCase().split(" ").join("-");
  let slug = `${baseSlug}`;
  let counter = 0;
  while (await Tour.exists({ slug })) {
    slug = `${slug}-${counter++}`;
  }
  payload.slug = slug;
  const tour = await Tour.create(payload);
  return tour;
};
const getAllTour = async (query: Record<string, string>) => {
  const filter = query;
  const searchTerm = query.searchTerm || "";
  delete filter["searchTerm"]


  const searchQuery ={ $or:tourSearchAbleFields.map((field) => ({
    [field]: { $regex: searchTerm, $options: "i" },
  }))
  }
  
  const tours = await Tour.find(searchQuery).find(filter);
  const totalTours = await Tour.countDocuments();
  return {
    data: tours,
    meta: {
      total: totalTours,
    },
  };
};
const updateTour = async (id: string, payload: ITour) => {
  const isTourExist = await Tour.findById(id);
  if (!isTourExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour is not exist");
  }

  if (payload.title) {
    const baseSlug = payload.title?.toLocaleLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;
    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    payload.slug = slug;
  }
  const updateTour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updateTour;
};
const deleteTour = async (id: string) => {
  const isTourExist = await Tour.findById(id);

  if (!isTourExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour  doesn't Exist");
  }
  await Tour.findByIdAndDelete(id);
  return null;
};
export const tourServices = {
  createTourType,
  getAllTourType,
  updateTourType,
  deleteTourType,
  createTour,
  getAllTour,
  updateTour,
  deleteTour,
};
