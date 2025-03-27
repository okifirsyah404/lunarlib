import { registerAs } from '@nestjs/config';
import { IsDefined, IsString } from 'class-validator';

/**
 * Represents the configuration for JWT settings.
 *
 * @typedef {Object} JwtConfig
 * @property {string} accessTokenSecret - The secret key for access tokens.
 * @property {string} accessTokenExpiresIn - The expiration time for access tokens.
 */
export type JwtConfig = {
	accessTokenSecret: string;
	accessTokenExpiresIn: string;
};

/**
 * Configuration for JWT (JSON Web Token) settings.
 *
 * This configuration is registered under the name 'jwtConfig' and provides
 * the necessary secrets and expiration times for access tokens, refresh tokens,
 * and signature tokens.
 *
 * @returns {JwtConfig} The JWT configuration object.
 *
 * Properties:
 * - `accessTokenSecret`: The secret key for access tokens, derived from the `JWT_SECRET` environment variable.
 * - `accessTokenExpiresIn`: The expiration time for access tokens, derived from the `JWT_EXPIRES_IN` environment variable.
 */
export const jwtConfig = registerAs(
	'jwtConfig',
	(): JwtConfig => ({
		accessTokenSecret: process.env.JWT_SECRET!,
		accessTokenExpiresIn: process.env.JWT_EXPIRES_IN!,
	}),
);

/**
 *
 * Class representing the environment variables required for JWT configuration.
 *
 */
export class JwtConfigEnvironmentVariables {
	@IsString()
	@IsDefined()
	JWT_SECRET: string;

	@IsString()
	@IsDefined()
	JWT_EXPIRES_IN: string;
}
