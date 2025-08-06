/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelpers/appError";
import stream from "stream"

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const regex = /\/([^\/]+)\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i;
    const match = url.match(regex);
    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log(`File ${public_id} deleted from cloudinary`);
    }
  } catch (error: any) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "Cloudinary image deletion error",
      error.message
    );
  }
};
export const uploadBufferToCloudinary = async (buffer: Buffer, fileName: string):Promise< UploadApiResponse | undefined> => {
  try {
    return new Promise((resolve, reject) => {
      const public_id = `pdf/${fileName}-${Date.now()}`
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer)
      cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          public_id: public_id,
          folder:"pdf"
        },
        (error, result) => {
          if (error) {
            return reject(error)
          }
          return resolve(result)
        }
      ).end(buffer)
    })
   }
  catch (error:any) {
    throw new AppError(httpStatus.BAD_REQUEST,`${error.message}`)
  }
}
export const cloudinaryUpload = cloudinary;
