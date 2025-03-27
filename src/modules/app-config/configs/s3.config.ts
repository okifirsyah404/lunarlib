import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';

/**
 * Configuration settings for connecting to an S3-compatible storage service.
 *
 * @property {string} accessKeyId - The access key ID used for authentication.
 * @property {string} secretAccessKey - The secret access key used for authentication.
 * @property {string} endPoint - The endpoint URL of the S3 service.
 * @property {string} [bucketName] - The optional name of the S3 bucket.
 * @property {string} [region] - The optional region where the S3 bucket is located.
 */
export type S3Config = {
	accessKeyId: string;
	secretAccessKey: string;
	endPoint: string;
	bucketName: string;
	region: string;
};

/**
 * Configuration for AWS S3.
 *
 * This configuration is registered under the name 's3Config' and provides
 * the necessary credentials and settings for connecting to an S3 bucket.
 *
 * @returns {S3Config} The S3 configuration object.
 *
 * Properties:
 * - `accessKeyId` (string): The access key ID used for authentication, derived from the `S3_ACCESS_KEY_ID` environment variable.
 * - `secretAccessKey` (string): The secret access key used for authentication, derived from the `S3_SECRET_ACCESS_KEY` environment variable.
 * - `endPoint` (string): The endpoint URL of the S3 service, derived from the `S3_ENDPOINT` environment variable.
 * - `bucketName` (string): The name of the S3 bucket, derived from the `S3_BUCKET_NAME` environment variable. Optional.
 * - `region` (string): The region where the S3 bucket is located, derived from the `S3_REGION` environment variable. Optional.
 *
 */
export const s3Config = registerAs(
	's3Config',
	(): S3Config => ({
		accessKeyId: process.env.S3_ACCESS_KEY_ID!,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
		endPoint: process.env.S3_ENDPOINT!,
		bucketName: process.env.S3_BUCKET_NAME!,
		region: process.env.S3_REGION!,
	}),
);

/**
 * Class representing the environment variables required for S3 configuration.
 *
 * @property {string} [S3_ACCESS_KEY_ID] - The access key ID for S3. Optional.
 * @property {string} [S3_SECRET_ACCESS_KEY] - The secret access key for S3. Optional.
 * @property {string} [S3_ENDPOINT] - The endpoint URL for S3. Optional.
 * @property {string} [S3_BUCKET_NAME] - The name of the S3 bucket. Optional.
 * @property {string} [S3_REGION] - The region where the S3 bucket is located. Optional.
 */
export class S3ConfigEnvironmentVariables {
	@IsOptional()
	@IsString()
	S3_ACCESS_KEY_ID: string;

	@IsOptional()
	@IsString()
	S3_SECRET_ACCESS_KEY: string;

	@IsOptional()
	@IsString()
	S3_ENDPOINT: string;

	@IsOptional()
	@IsString()
	S3_BUCKET_NAME: string;

	@IsOptional()
	@IsString()
	S3_REGION: string;
}
