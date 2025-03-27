interface S3Options {
	endPoint: string;
	accessKeyId: string;
	secretAccessKey: string;
	bucketName: string;
	region: string;
}

export interface S3StorageOptions {
	imports?: any[];
	global?: boolean;
	s3Options: S3Options;
}

export interface S3StorageAsyncOptions {
	inject?: any[];
	imports?: any[];
	global?: boolean;
	useFactory?: (...args: any[]) => Promise<S3StorageOptions> | S3StorageOptions;
}

export interface S3StorageUploadObjectParam {
	key: string;
	body: Buffer | string;
	contentType: string;
}
