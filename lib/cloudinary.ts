import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});
export async function uploadCloudinary(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "dev-event/users",
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        },
      )
      .end(buffer);
  });
}

export default cloudinary;
