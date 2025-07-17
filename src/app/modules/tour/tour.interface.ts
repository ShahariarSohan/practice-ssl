import { Types } from "mongoose";

export interface ITourType {
  name: string;
}

export interface ITour {
  slug: string;
  title: string;
  description?: string;
  images?: string[];
  location?: string;
  costFrom?: number;
  startDate?: Date;
  endDate?: Date;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
    tourPlan?: string[];
    minAge?: number;
  tourType: Types.ObjectId;
  division: Types.ObjectId;
}
