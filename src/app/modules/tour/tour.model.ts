import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema)

const tourSchema = new Schema<ITour>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    minAge:{type:Number},
    division: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "Division",
    },
  },
  {
    timestamps: true,
    versionKey:false,
  }
);

export const Tour=model<ITour>("Tour",tourSchema)