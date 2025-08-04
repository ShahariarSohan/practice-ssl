

import { Types } from "mongoose";

export enum GUIDE_STATUS {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IGuide {
  user: Types.ObjectId;
  nidPhoto: string;
  division: Types.ObjectId;
  status?: GUIDE_STATUS;
}
