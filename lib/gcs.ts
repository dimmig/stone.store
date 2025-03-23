import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME || '');

export async function uploadToGCS(file: File) {
  try {
    const buffer = await file.arrayBuffer();
    const filename = `${uuidv4()}-${file.name}`;
    const blob = bucket.file(`${filename}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.type,
      },
    });

    return new Promise<{ url: string; filename: string }>((resolve, reject) => {
      blobStream.on('error', (error) => {
        console.error('Error uploading to GCS:', error);
        reject(error);
      });

      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve({ url: publicUrl, filename: blob.name });
      });

      blobStream.end(Buffer.from(buffer));
    });
  } catch (error) {
    console.error('Error in uploadToGCS:', error);
    throw error;
  }
}

export async function deleteFromGCS(filename: string) {
  try {
    await bucket.file(filename).delete();
  } catch (error) {
    console.error('Error deleting from GCS:', error);
    throw error;
  }
} 