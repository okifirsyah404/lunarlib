import * as awsS3 from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
	S3StorageOptions,
	S3StorageUploadObjectParam,
} from '@contract/s3storage/s3storage.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { DiKeysConstant } from 'src/constants/keys/di-keys.constant';

@Injectable()
export class S3StorageService {
	constructor(
		@Inject(DiKeysConstant.DI_S3_STORAGE_MODULE_OPTIONS)
		private readonly options: S3StorageOptions,
	) {
		this._connect();
	}

	private readonly logger = new Logger(S3StorageService.name);

	/**
	 *
	 * The S3 client instance used to interact with the S3 storage service.
	 *
	 * @private
	 *
	 */
	private s3Instance!: awsS3.S3Client;

	/**
	 *
	 * The name of the bucket in the S3 storage.
	 *
	 * @private
	 *
	 */
	private bucketName!: string;

	/**
	 *
	 * The S3 client instance used to interact with the S3 storage service.
	 *
	 * @returns The S3 client instance.
	 *
	 */
	get s3Client(): awsS3.S3Client {
		return this.s3Instance;
	}

	/**
	 *
	 * The name of the bucket in the S3 storage.
	 *
	 * @returns The bucket name.
	 *
	 */
	get bucket(): string {
		return this.bucketName;
	}

	/**
	 *
	 * Establishes a connection to the S3 storage service.
	 *
	 * @private
	 *
	 */
	private _connect(): void {
		try {
			this.s3Instance = new awsS3.S3Client({
				endpoint: this.options.s3Options.endPoint,
				region: this.options.s3Options.region,
				forcePathStyle: true,
				credentials: {
					accessKeyId: this.options.s3Options.accessKeyId,
					secretAccessKey: this.options.s3Options.secretAccessKey,
				},
			});

			this.bucketName = this.options.s3Options.bucketName;

			this.logger.log(
				`S3 Storage Service: Connected to ${this.options.s3Options.endPoint}`,
			);
		} catch (error) {
			this.logger.error((error as Error).toString());
		}
	}

	/**
	 *
	 * Uploads an object to the S3 storage.
	 *
	 * @param {S3StorageUploadObjectParam} data - The object data to be uploaded.
	 *
	 * @returns A Promise that resolves when the object is successfully uploaded.
	 *
	 */
	async uploadObject(data: S3StorageUploadObjectParam): Promise<void> {
		const _body =
			typeof data.body === 'string' ? fs.readFileSync(data.body) : data.body;

		await this.s3Instance.send(
			new awsS3.PutObjectCommand({
				Bucket: this.bucketName,
				Key: data.key,
				Body: _body,
				ContentType: data.contentType,
			}),
		);
	}

	/**
	 *
	 * Retrieves a signed URL for the specified key from the S3 storage.
	 *
	 * @param { string } key - The key of the object in the S3 storage.
	 *
	 * @returns A Promise that resolves to the signed URL.
	 *
	 */
	async getSignedUrl(key: string): Promise<string> {
		const command = new awsS3.GetObjectCommand({
			Bucket: this.bucketName,
			Key: key,
		});

		return await getSignedUrl(this.s3Instance, command, {
			expiresIn: 7200,
		});
	}

	/**
	 *
	 * Deletes an object from the S3 storage.
	 *
	 * @param { string } key - The key of the object to delete.
	 *
	 * @returns A Promise that resolves when the object is successfully deleted.
	 *
	 */
	async deleteObject(key: string): Promise<void> {
		await this.s3Instance.send(
			new awsS3.DeleteObjectCommand({
				Bucket: this.bucketName,
				Key: key,
			}),
		);
	}
}
