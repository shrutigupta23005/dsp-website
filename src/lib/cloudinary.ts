import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload an image to Cloudinary
 * @param file - Base64 encoded image string or URL
 * @param folder - Target folder in Cloudinary (e.g., "products/nike-air-max")
 */
export async function uploadImage(
  file: string,
  folder: string
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(file, {
    folder: `delhi-shoe-palace/${folder}`,
    resource_type: "image",
    transformation: [
      { quality: "auto", fetch_format: "auto" },
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

/**
 * Delete an image from Cloudinary by its public ID
 */
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Generate a Cloudinary URL with transformations
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  } = {}
): string {
  const { width, height, crop = "fill", quality = "auto" } = options;

  return cloudinary.url(publicId, {
    transformation: [
      {
        width,
        height,
        crop,
        quality,
        fetch_format: "auto",
      },
    ],
    secure: true,
  });
}

/**
 * Generate a blur placeholder (LQIP) URL from Cloudinary
 */
export function getBlurPlaceholder(publicId: string): string {
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: 20,
        quality: 30,
        effect: "blur:1000",
        fetch_format: "auto",
      },
    ],
    secure: true,
  });
}
