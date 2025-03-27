import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import mime from 'mime';
import path from 'path';

import { IProfileEntity } from '@contract/entities/users/profile.entity.interface';
import { IPostResponse } from 'src/contracts/responses/post.response.interface';
import { SetCache } from 'src/infrastructures/decorators/app-cache.decorator';
import { FileUtil } from 'src/utils/file.util';
import { S3StorageService } from './s3storage.service';

@Injectable()
export class AppS3StorageService {
	constructor(private readonly service: S3StorageService) {}

	/**
	 *
	 * Generates a signed URL for accessing a profile image stored in S3.
	 *
	 * @param profile - The profile object containing the image key.
	 * @returns A promise that resolves to the profile object with the signed URL as the image key.
	 *
	 * @remarks
	 * If the profile does not have an image key, the original profile object is returned.
	 * The signed URL is valid for 3600 seconds (1 hour).
	 *
	 * @example
	 * ```typescript
	 * const profile = { imageKey: 'path/to/image.jpg' };
	 * const updatedProfile = await getProfileSignedUrl(profile);
	 * console.log(updatedProfile.imageKey); // Signed URL
	 * ```
	 *
	 */
	@SetCache<IProfileEntity>(
		(profile: IProfileEntity) => `profile-signed-url:${profile.image}`,
		{
			ttl: 1,
			unit: 'minutes',
		},
	)
	async getProfileSignedUrl(profile: IProfileEntity): Promise<IProfileEntity> {
		const key = profile.image;

		if (!key) {
			return profile;
		}

		const command = new GetObjectCommand({
			Bucket: this.service.bucket,
			Key: key,
		});

		const url = await getSignedUrl(this.service.s3Client, command, {
			expiresIn: 7200,
		});

		return { ...profile, image: url };
	}

	/**
	 *
	 * Generates a signed URL for accessing a post image stored in S3.
	 *
	 * @param post - The post object containing the image key.
	 * @returns A promise that resolves to the post object with the signed URL as the image key.
	 *
	 * @remarks
	 * If the post does not have an image key, the original post object is returned.
	 * The signed URL is valid for 7200 seconds (2 hours).
	 *
	 * @example
	 * ```typescript
	 * const post = { id: '123', imageKey: 'path/to/image.jpg' };
	 * const updatedPost = await getPostSignedUrl(post);
	 * console.log(updatedPost.imageKey); // Signed URL
	 * ```
	 *
	 */
	@SetCache<IPostResponse>(
		(post: IPostResponse) => `post-signed-url:${post.id}${post.image}`,
		{
			ttl: 1,
			unit: 'minutes',
		},
	)
	async getPostSignedUrl(post: IPostResponse): Promise<IPostResponse> {
		const key = post.image;

		if (!key) {
			return post;
		}

		const command = new GetObjectCommand({
			Bucket: this.service.bucket,
			Key: key,
		});

		const url = await getSignedUrl(this.service.s3Client, command, {
			expiresIn: 7200,
		});

		return { ...post, image: url };
	}

	/**
	 *
	 * Uploads a profile image to the S3 storage.
	 *
	 * @param `seed` - The seed of the profile.
	 * @param `file` - The file object provided by Express.Multer.
	 *
	 * @returns A promise that resolves to the key of the uploaded file in the S3 storage.
	 *
	 */
	async uploadProfileImage({
		seed,
		file,
	}: {
		seed: string;
		file: Express.Multer.File;
	}): Promise<string> {
		const key = `users/${seed}.${FileUtil.getExtension(file)}`;

		const tempFilePath = await FileUtil.copyTempFile(file, seed);

		await this.service.uploadObject({
			key,
			body: tempFilePath,
			contentType: file.mimetype,
		});

		void FileUtil.deleteTempFile(tempFilePath);

		return key;
	}

	async uploadFileFromPath({
		seed,
		filePath,
		deleteAfterUpload,
	}: {
		seed: string;
		filePath: string;
		deleteAfterUpload?: boolean;
	}): Promise<string> {
		const key = `${seed}${path.extname(filePath)}`;

		const contentType = mime.getType(filePath) ?? 'image/*';

		await this.service.uploadObject({
			key,
			body: filePath,
			contentType,
		});

		if (deleteAfterUpload) {
			await FileUtil.deleteTempFile(filePath);
		}

		return key;
	}
}
