import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsBooleanString, IsDefined, IsNumber } from 'class-validator';

/**
 * Configuration settings for throttling.
 *
 * @typedef {Object} ThrottleConfig
 * @property {boolean} enable - Indicates whether throttling is enabled.
 * @property {number} ttl - Time to live for throttling in seconds.
 * @property {number} limit - Maximum number of requests allowed within the TTL.
 */
export type ThrottleConfig = {
	enable: boolean;
	ttl: number;
	limit: number;
};

/**
 * Configuration for request throttling.
 *
 * This configuration is registered under the name 'throttleConfig' and provides
 * settings for enabling throttling, the time-to-live (TTL) for throttling records,
 * and the request limit within the TTL period.
 *
 * @returns {ThrottleConfig} The throttling configuration object.
 *
 * Properties:
 * - `enable` (boolean): Indicates whether throttling is enabled, sourced from the environment variable `APP_ENABLE_THROTTLE`.
 * - `ttl` (number): Time to live for throttling in seconds, sourced from the environment variable `APP_THROTTLE_TTL`.
 * - `limit` (number): Maximum number of requests allowed within the TTL, sourced from the environment variable `APP_THROTTLE_LIMIT`.
 */
export const throttleConfig = registerAs(
	'throttleConfig',
	(): ThrottleConfig => ({
		enable: process.env.APP_ENABLE_THROTTLE === 'true',
		ttl: parseInt(process.env.APP_THROTTLE_TTL!),
		limit: parseInt(process.env.APP_THROTTLE_LIMIT!),
	}),
);

/**
 * Class representing the environment variables for throttle configuration.
 *
 * @class ThrottleEnvironmentVariables
 *
 * @property {string} APP_ENABLE_THROTTLE - Optional boolean string indicating if throttling is enabled.
 * @property {string} APP_THROTTLE_TTL - Optional number string representing the time-to-live (TTL) for throttling.
 * @property {string} APP_THROTTLE_LIMIT - Optional number string representing the limit for throttling.
 */
export class ThrottleConfigEnvironmentVariables {
	@IsBooleanString()
	@IsDefined()
	APP_ENABLE_THROTTLE: string;

	@Type(() => Number)
	@IsNumber()
	@IsDefined()
	APP_THROTTLE_TTL: number;

	@Type(() => Number)
	@IsNumber()
	@IsDefined()
	APP_THROTTLE_LIMIT: number;
}
