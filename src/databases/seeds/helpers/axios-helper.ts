/* eslint-disable @typescript-eslint/no-unsafe-call */

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import axios from 'axios';
import * as fs from 'fs';
import mime from 'mime';
import * as path from 'path';

export async function downloadFile(
	url: string,
	filePath: string,
): Promise<string> {
	if (!fs.existsSync(filePath)) {
		fs.mkdirSync(filePath, { recursive: true });
	}

	const millis = +new Date();
	const fileName = path.join(filePath, `${millis}.png`);
	const writer = fs.createWriteStream(fileName);

	const response = await axios({
		url,
		method: 'GET',
		responseType: 'stream',
	});

	response.data.pipe(writer);

	return new Promise((resolve, reject) => {
		writer.on('finish', () => {
			resolve(fileName);
		});
		writer.on('error', reject);
	});
}

export async function downloadAndStoreToS3(
	s3: S3Client,
	url: string,
	dir: string,
	key: string,
): Promise<string> {
	const tempFilePath = path.join(process.cwd(), 'temp', 'downloads');

	if (!fs.existsSync(tempFilePath)) {
		fs.mkdirSync(tempFilePath, { recursive: true });
	}

	const fileName = await downloadFile(url, tempFilePath);
	const fileExt = path.extname(fileName);
	const fileKeyWithExt = `${key}${fileExt}`;

	const fileKey = `${dir}/${fileKeyWithExt}`;

	const mimeType = mime.getType(fileName);
	const fileMimeType =
		typeof mimeType === 'string' ? mimeType : 'application/octet-stream';

	await s3.send(
		new PutObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: fileKey,
			Body: fs.readFileSync(fileName),
			ContentType: fileMimeType,
		}),
	);

	fs.unlinkSync(fileName);

	return fileKey;
}
