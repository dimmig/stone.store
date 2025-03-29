import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || '';

export type GCSUploadResult = {
  url: string;
  filename: string;
};

export const uploadToGCS = async (file: File): Promise<GCSUploadResult> => {
  if (!bucketName) {
    throw new Error('Google Cloud Storage bucket name is not configured');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${uuidv4()}-${file.name}`;
  const bucket = storage.bucket(bucketName);
  const blob = bucket.file(filename);

  // @ts-ignore
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.type,
    },
    resumable: false,
  });

  // Return a promise that resolves when the upload is complete
  return new Promise((resolve, reject) => {
    blobStream.on('error', (error) => reject(error));

    blobStream.on('finish', async () => {
      try {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
        resolve({ url: publicUrl, filename });
      } catch (error) {
        reject(error);
      }
    });

    blobStream.end(buffer);
  });
};

export const uploadMultipleToGCS = async (files: File[]): Promise<GCSUploadResult[]> => {
  const uploadPromises = files.map(file => uploadToGCS(file));
  return await Promise.all(uploadPromises);
};

export const deleteFromGCS = async (filename: string): Promise<void> => {
  if (!filename) return;

  if (!bucketName) {
    throw new Error('Google Cloud Storage bucket name is not configured');
  }

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filename);

  try {
    await file.delete();
  } catch (error: any) {
    // If the file doesn't exist (404), just continue
    if (error?.code === 404) return;
    throw error;
  }
};