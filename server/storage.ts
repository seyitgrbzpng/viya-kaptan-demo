import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary
 * @param key - The path/filename for the uploaded file
 * @param data - Buffer containing the file data
 * @param mimeType - MIME type of the file
 * @returns Object containing the URL and public_id
 */
export async function storagePut(
  key: string,
  data: Buffer,
  mimeType: string
): Promise<{ url: string; publicId: string }> {
  // Check if Cloudinary is configured
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn('[Cloudinary] Not configured. Skipping upload.');
    // Return a placeholder URL for development
    return {
      url: `/placeholder/${key}`,
      publicId: key,
    };
  }

  try {
    // Convert buffer to base64 data URI
    const base64Data = `data:${mimeType};base64,${data.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: 'viya-kaptan',
      public_id: key.replace(/\.[^/.]+$/, ''), // Remove file extension
      resource_type: 'auto', // Auto-detect file type
      overwrite: false,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('[Cloudinary] Upload failed:', error);
    throw new Error(`Failed to upload to Cloudinary: ${error}`);
  }
}

/**
 * Delete a file from Cloudinary
 * @param publicId - The public ID of the file to delete
 */
export async function storageDelete(publicId: string): Promise<void> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn('[Cloudinary] Not configured. Skipping delete.');
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`[Cloudinary] Deleted: ${publicId}`);
  } catch (error) {
    console.error('[Cloudinary] Delete failed:', error);
    throw new Error(`Failed to delete from Cloudinary: ${error}`);
  }
}

/**
 * Get a signed URL for temporary access (optional - Cloudinary URLs are public by default)
 * @param publicId - The public ID of the file
 * @param expiresIn - Expiration time in seconds (default: 3600)
 */
export function getSignedUrl(publicId: string, expiresIn: number = 3600): string {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return `/placeholder/${publicId}`;
  }

  const timestamp = Math.floor(Date.now() / 1000) + expiresIn;

  return cloudinary.url(publicId, {
    sign_url: true,
    type: 'authenticated',
    expires_at: timestamp,
  });
}
