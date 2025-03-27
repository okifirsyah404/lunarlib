import { registerAs } from '@nestjs/config';
import { IsDefined, IsNumberString, IsString } from 'class-validator';

/**
 * Represents the configuration settings for a Redis instance.
 *
 * @property {string} host - The hostname of the Redis server.
 * @property {number} port - The port number on which the Redis server is running.
 * @property {string} url - The URL of the Redis server.
 * @property {number} ttl - The time-to-live (TTL) value for Redis keys.
 */
export type RedisConfig = {
	host: string;
	port: number;
	url: string;
	ttl: number;
};

/**
 * Configuration for Redis.
 *
 * This configuration is registered under the name 'redisConfig' and provides
 * the necessary settings for connecting to a Redis instance.
 *
 * @returns {RedisConfig} The Redis configuration object.
 *
 * Properties:
 * - `host` (string): The hostname of the Redis server, derived from the `REDIS_HOST` environment variable.
 * - `port` (number): The port number on which the Redis server is running, derived from the `REDIS_PORT` environment variable.
 * - `url` (string): The URL of the Redis server, derived from the `REDIS_URL` environment variable.
 * - `ttl` (number): The time-to-live (TTL) value for Redis keys, derived from the `REDIS_TTL` environment variable.
 */
export const redisConfig = registerAs(
	'redisConfig',
	(): RedisConfig => ({
		host: process.env.REDIS_HOST!,
		port: parseInt(process.env.REDIS_PORT!, 10),
		url: process.env.REDIS_URL!,
		ttl: parseInt(process.env.REDIS_TTL!, 10),
	}),
);

/**
 * Class representing the environment variables required for Redis configuration.
 *
 * @class RedisEnvironmentVariables
 *
 * @property {string} REDIS_HOST - The host address of the Redis server.
 * @property {string} REDIS_PORT - The port number on which the Redis server is running.
 * @property {string} REDIS_URL - The URL of the Redis server.
 * @property {string} REDIS_TTL - The time-to-live (TTL) value for Redis keys.
 */
export class RedisConfigEnvironmentVariables {
	@IsDefined()
	@IsString()
	REDIS_HOST: string;

	@IsDefined()
	@IsNumberString()
	REDIS_PORT: string;

	@IsDefined()
	@IsString()
	REDIS_URL: string;

	@IsDefined()
	@IsNumberString()
	REDIS_TTL: string;
}
