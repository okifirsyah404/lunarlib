/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConfigModule } from '@nestjs/config';
import { AppConfig, Environment } from '../configs/app.config';
import { BcryptConfig } from '../configs/bcrypt.config';
import { DatabaseConfig } from '../configs/database.config';
import { JwtConfig } from '../configs/jwt.config';
import { RedisConfig } from '../configs/redis.config';
import { S3Config } from '../configs/s3.config';
import { ThrottleConfig } from '../configs/throttle.config';

export class AppConfigLoaded {
	static async appConfig(): Promise<AppConfig> {
		await ConfigModule.envVariablesLoaded;

		return {
			env:
				Environment[(process.env.NODE_ENV ?? 'dev').toUpperCase()] ||
				Environment.DEV,
			appName: process.env.APP_NAME!,
			timezone: process.env.TZ!,
			appHost: process.env.APP_HOST!,
			appPort: parseInt(process.env.APP_PORT!),
			appUrl: process.env.APP_URL!,
			appVersion: parseInt(process.env.APP_VERSION!),
		};
	}

	static async jwtConfig(): Promise<JwtConfig> {
		await ConfigModule.envVariablesLoaded;

		return {
			accessTokenSecret: process.env.JWT_SECRET!,
			accessTokenExpiresIn: process.env.JWT_EXPIRES_IN!,
		};
	}

	static async s3Config(): Promise<S3Config> {
		await ConfigModule.envVariablesLoaded;

		return {
			accessKeyId: process.env.S3_ACCESS_KEY_ID!,
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
			endPoint: process.env.S3_ENDPOINT!,
			bucketName: process.env.S3_BUCKET_NAME!,
			region: process.env.S3_REGION!,
		};
	}

	static async redisConfig(): Promise<RedisConfig> {
		await ConfigModule.envVariablesLoaded;

		return {
			host: process.env.REDIS_HOST!,
			port: parseInt(process.env.REDIS_PORT!),
			url: process.env.REDIS_URL!,
			ttl: parseInt(process.env.REDIS_TTL!),
		};
	}

	static async throttleConfig(): Promise<ThrottleConfig> {
		await ConfigModule.envVariablesLoaded;

		return {
			enable: process.env.APP_ENABLE_THROTTLE === 'true',
			ttl: parseInt(process.env.APP_THROTTLE_TTL!),
			limit: parseInt(process.env.APP_THROTTLE_LIMIT!),
		};
	}

	static async databaseConfig(): Promise<DatabaseConfig> {
		await ConfigModule.envVariablesLoaded;

		return {
			provider: process.env.DB_PROVIDER!,
			host: process.env.DB_HOST!,
			port: parseInt(process.env.DB_PORT!),
			name: process.env.DB_NAME!,
			user: process.env.DB_USERNAME!,
			password: process.env.DB_PASSWORD!,
			url: process.env.DATABASE_URL!,
		};
	}

	static async bcryptConfig(): Promise<BcryptConfig> {
		await ConfigModule.envVariablesLoaded;

		return {
			saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS!),
		};
	}
}
