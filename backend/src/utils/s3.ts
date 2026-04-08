import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET!;

/**
 * Upload a resume file to S3.
 * Key format: resumes/{userId}/{filename}
 */
export const uploadResumeToS3 = async (
  userId: string,
  buffer: Buffer,
  mimetype: string,
  originalName: string
): Promise<string> => {
  const key = `resumes/${userId}/${Date.now()}_${originalName}`;

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  }));

  return key;
};

/**
 * Download a resume file from S3.
 * Returns the file buffer.
 */
export const downloadResumeFromS3 = async (key: string): Promise<Buffer> => {
  const response = await s3.send(new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  }));

  if (!response.Body) {
    throw new Error('Empty response from S3');
  }

  // Convert the readable stream to a buffer
  const stream = response.Body as Readable;
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};
