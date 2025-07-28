import { model, Schema } from "mongoose";
import { GUIDE_STATUS, IGuide } from "./guide.interface";

const guideSchema = new Schema<IGuide>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    nidPhoto: {
      type: String,
      required: true,
    },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      require: true,
    },
    status: {
      type: String,
      enum: Object.values(GUIDE_STATUS),
      default: GUIDE_STATUS.PENDING,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Guide = model<IGuide>("Guide", guideSchema);
