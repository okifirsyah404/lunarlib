import { IntersectionType } from '@nestjs/mapped-types';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AppConfigEnvironmentVariables } from '../configs/app.config';
import { BcryptConfigEnvironmentVariables } from '../configs/bcrypt.config';
import { DatabaseConfigEnvironmentVariables } from '../configs/database.config';
import { JwtConfigEnvironmentVariables } from '../configs/jwt.config';
import { RedisConfigEnvironmentVariables } from '../configs/redis.config';
import { S3ConfigEnvironmentVariables } from '../configs/s3.config';
import { ThrottleConfigEnvironmentVariables } from '../configs/throttle.config';

class EnvironmentVariables extends IntersectionType(
	AppConfigEnvironmentVariables,
	BcryptConfigEnvironmentVariables,
	DatabaseConfigEnvironmentVariables,
	JwtConfigEnvironmentVariables,
	RedisConfigEnvironmentVariables,
	S3ConfigEnvironmentVariables,
	ThrottleConfigEnvironmentVariables,
) {}

/**
 * Validates the provided configuration object on env files.
 *
 * @param config - The configuration object to validate.
 * @returns The validated configuration object.
 * @throws Error if any environment variable is missing or doesn't match the expected type.
 */
export function validateConfig(
	config: Record<string, unknown>,
): EnvironmentVariables {
	// Convert the plain object to an instance of the EnvironmentVariables class.
	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true,
	});

	// Validate the configuration object.
	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
	});

	if (errors.length > 0) {
		const errorMessages = errors
			.map((error) => JSON.stringify(error))
			.join('\n');
		throw new Error(`Some Env was missing or didn't match \n ${errorMessages}`);
	}
	return validatedConfig;
}
