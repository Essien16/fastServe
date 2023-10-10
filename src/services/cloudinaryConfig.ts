import { getEnvironmentVariables } from "../environments/environment";
import { Request, Response, NextFunction } from "express"
import { v2 as cloudinary } from "cloudinary"

export const cloudConfig = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  cloudinary.config({
    cloud_name: getEnvironmentVariables().cloudinary_auth.cloud_name,
    api_key: getEnvironmentVariables().cloudinary_auth.api_key,
    api_secret: getEnvironmentVariables().cloudinary_auth.api_secret,
  })

  next()
}

export const cloudinaryUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file || !req.file.path) {
      throw new Error('No file uploaded');
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    req.body.cloudinaryUrl = result.url;
    //  const result = await cloudinary.uploader.upload(
    //    req.file.buffer.toString("base64"),
    //    { resource_type: "auto" }
    //  )
    //  req.body.cloudinaryUrl = result.url

    next();
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    next(error);
  }
};

