import {
	DeleteObjectCommand,
	ListObjectsCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import * as fs from 'fs';
import mime from 'mime';

export async function putObjectToS3(
	s3: S3Client,
	filePath: string,
	key: string,
): Promise<string> {
	await s3.send(
		new PutObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: key,
			Body: fs.createReadStream(filePath),
			ContentType: mime.getType(filePath) || 'application/octet-stream',
		}),
	);

	return key;
}

export async function deleteObjectsAndDir(
	s3: S3Client,
	mainDir: string,
): Promise<void> {
	const objects = await s3.send(
		new ListObjectsCommand({
			Bucket: process.env.S3_BUCKET_NAME,
		}),
	);

	if (objects.Contents) {
		for (const object of objects.Contents) {
			if (object.Key?.includes(mainDir)) {
				await s3.send(
					new DeleteObjectCommand({
						Bucket: process.env.S3_BUCKET_NAME,
						Key: object.Key,
					}),
				);
			}
		}
	}
}
