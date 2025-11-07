import cloudinary from '../config/cloudinary';

export type UploadedImage = { url: string; publicId: string };

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  folder: string
): Promise<UploadedImage> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
        // You can add other options like eager transformations for thumbnails
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result!.secure_url, publicId: result!.public_id });
      }
    );
    stream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    // log but don't crash
    console.error('Cloudinary delete error:', err);
  }
};
