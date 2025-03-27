import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../configs/app.config';
import { BcryptConfig } from '../configs/bcrypt.config';
import { DatabaseConfig } from '../configs/database.config';
import { JwtConfig } from '../configs/jwt.config';
import { RedisConfig } from '../configs/redis.config';
import { S3Config } from '../configs/s3.config';
import { ThrottleConfig } from '../configs/throttle.config';

@Injectable()
export class AppConfigService {
	constructor(private readonly config: ConfigService) {}

	/**
	 * Retrieves the application configuration.
	 *
	 * @returns {AppConfig} The application configuration object.
	 */
	get appConfig(): AppConfig {
		return this.config.get<AppConfig>('appConfig')!;
	}

	/**
	 * Retrieves the bcrypt configuration settings.
	 *
	 * @returns {BcryptConfig} The bcrypt configuration settings.
	 */
	get bcryptConfig(): BcryptConfig {
		return this.config.get<BcryptConfig>('bcryptConfig')!;
	}

	/**
	 * Retrieves the JWT configuration settings.
	 *
	 * @returns {JwtConfig} The JWT configuration settings.
	 */
	get jwtConfig(): JwtConfig {
		return this.config.get<JwtConfig>('jwtConfig')!;
	}

	/**
	 * Retrieves the S3 configuration settings.
	 *
	 * @returns {S3Config} The S3 configuration object.
	 */
	get s3Config(): S3Config {
		return this.config.get<S3Config>('s3Config')!;
	}

	/**
	 * Retrieves the Redis configuration settings.
	 *
	 * @returns {RedisConfig} The configuration settings for Redis.
	 */
	get redisConfig(): RedisConfig {
		return this.config.get<RedisConfig>('redisConfig')!;
	}

	/**
	 * Retrieves the throttle configuration settings.
	 *
	 * @returns {ThrottleConfig} The throttle configuration.
	 */
	get throttleConfig(): ThrottleConfig {
		return this.config.get<ThrottleConfig>('throttleConfig')!;
	}

	/**
	 * Retrieves the database configuration settings.
	 *
	 * @returns {DatabaseConfig} The database configuration object.
	 */
	get databaseConfig(): DatabaseConfig {
		return this.config.get<DatabaseConfig>('databaseConfig')!;
	}
}
