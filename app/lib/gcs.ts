import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

interface ServiceAccountCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

// Load service account credentials
const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
let credentials: ServiceAccountCredentials | null = null;

try {
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error('Service account file not found');
  }
  credentials = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8')) as ServiceAccountCredentials;
} catch (error) {
  console.error('Error loading service account credentials:', error);
  throw new Error('Failed to load Google Cloud credentials');
}

// Initialize storage with credentials
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: credentials,
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || '';

export async function uploadToGCS(file: File): Promise<{ url: string; filename: string }> {
  try {
    if (!bucketName) {
      throw new Error('Google Cloud Storage bucket name is not configured');
    }

    if (!credentials) {
      throw new Error('Google Cloud credentials not properly loaded');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${uuidv4()}-${file.name}`;
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(filename);

    // Create a write stream with public read access
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.type,
      },
      resumable: false,
    });

    // Return a promise that resolves when the upload is complete
    return new Promise((resolve, reject) => {
      blobStream.on('error', (error) => {
        console.error('Error uploading to GCS:', error);
        reject(error);
      });

      blobStream.on('finish', async () => {
        try {
          // Generate a public URL without making individual file public
          const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
          resolve({ url: publicUrl, filename });
        } catch (error) {
          console.error('Error generating public URL:', error);
          reject(error);
        }
      });

      // Write the buffer to the stream
      blobStream.end(buffer);
    });
  } catch (error) {
    console.error('Error in uploadToGCS:', error);
    throw error;
  }
}

export async function deleteFromGCS(filename: string): Promise<void> {
  try {
    if (!filename) {
      console.warn('No filename provided for deletion');
      return;
    }

    if (!bucketName) {
      throw new Error('Google Cloud Storage bucket name is not configured');
    }

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);

    // Check if file exists before attempting to delete
    const [exists] = await file.exists();
    if (!exists) {
      console.warn(`File ${filename} does not exist in GCS, skipping deletion`);
      return;
    }

    await file.delete();
    console.log(`Successfully deleted file: ${filename}`);
  } catch (error) {
    console.error('Error in deleteFromGCS:', error);
    // Don't throw if the file doesn't exist
    if (error && typeof error === 'object' && 'code' in error && error.code === 404) {
      return;
    }
    throw error;
  }
}

export async function testGCSConnection(): Promise<boolean> {
  try {
    if (!bucketName) {
      throw new Error('Google Cloud Storage bucket name is not configured');
    }

    if (!credentials) {
      throw new Error('Google Cloud credentials not properly loaded');
    }

    const bucket = storage.bucket(bucketName);
    const [exists] = await bucket.exists();
    
    if (!exists) {
      throw new Error(`Bucket ${bucketName} does not exist`);
    }

    // Try to create a test file
    const testFile = bucket.file('test.txt');
    await testFile.save('Hello World');
    
    // Clean up the test file
    await testFile.delete();
    
    return true;
  } catch (error) {
    console.error('GCS connection test failed:', error);
    return false;
  }
} 