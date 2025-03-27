import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import {
	IsDefined,
	IsEnum,
	IsInt,
	IsIP,
	IsString,
	IsTimeZone,
} from 'class-validator';

/**
 * Enum representing different environments for the application.
 *
 * @enum {string}
 * @property {string} Dev - Represents the development environment.
 * @property {string} Staging - Represents the staging environment.
 * @property {string} Prod - Represents the production environment.
 * @property {string} Test - Represents the test environment.
 */
export enum Environment {
	LOCAL = 'local',
	DEV = 'dev',
	STAGING = 'staging',
	PROD = 'prod',
	TEST = 'test',
}

/**
 * Represents the application configuration.
 *
 * @property {Environment} env - The environment in which the application is running.
 * @property {string} appName - The name of the application.
 * @property {string} timezone - The timezone of the application.
 * @property {string} appHost - The host address of the application.
 * @property {number} appPort - The port number on which the application is running.
 * @property {string} appUrl - The base URL of the application.
 * @property {number} appVersion - The version of the application.
 *
 */
export type AppConfig = {
	env: Environment;
	appName: string;
	timezone: string;
	appHost: string;
	appPort: number;
	appUrl: string;
	appVersion: number;
};

/**
 * Configuration object for the application.
 *
 * This configuration is registered under the name 'appConfig' and provides
 * environment-specific settings for the application.
 *
 * @returns {AppConfig} The application configuration object.
 *
 * Properties:
 * - `env`: The current environment of the application, derived from the `NODE_ENV` environment variable.
 *          Defaults to `Environment.Dev` if `NODE_ENV` is not set or does not match any known environment.
 * - `appName`: The name of the application, derived from the `APP_NAME` environment variable.
 * - `timezone`: The timezone of the application, derived from the `TZ` environment variable.
 * - `host`: The host address of the application, derived from the `APP_HOST` environment variable.
 * - `port`: The port number on which the application is running, derived from the `APP_PORT` environment variable.
 * - `url`: The base URL of the application, derived from the `APP_URL` environment variable.
 * - `version`: The version of the application, derived from the `APP_VERSION` environment variable.
 */
export const appConfig = registerAs(
	'appConfig',
	(): AppConfig => ({
		env:
			(process.env.NODE_ENV &&
				Environment[
					process.env.NODE_ENV.toUpperCase() as keyof typeof Environment
				]) ||
			Environment.DEV,
		appName: process.env.APP_NAME!,
		timezone: process.env.TZ!,
		appHost: process.env.APP_HOST!,
		appPort: parseInt(process.env.APP_PORT!, 10),
		appUrl: process.env.APP_URL!,
		appVersion: parseInt(process.env.APP_VERSION!, 10),
	}),
);

/**
 * Class representing the environment variables for the application configuration.
 *
 * @property {Environment} NODE_ENV - The environment in which the application is running.
 * @property {string} APP_NAME - The name of the application.
 * @property {string} TZ - The timezone of the application.
 * @property {string} APP_HOST - The host address of the application.
 * @property {number} APP_PORT - The port number on which the application is running.
 * @property {string} APP_URL - The URL of the application.
 * @property {number} APP_VERSION - The version of the application.
 */
export class AppConfigEnvironmentVariables {
	@IsEnum(Environment)
	@IsDefined()
	NODE_ENV: Environment;

	@IsString()
	@IsDefined()
	APP_NAME: string;

	@IsTimeZone()
	@IsString()
	@IsDefined()
	TZ: string;

	@IsIP()
	@IsString()
	@IsDefined()
	APP_HOST: string;

	@Type(() => Number)
	@IsInt()
	@IsDefined()
	APP_PORT: number;

	@IsString()
	@IsDefined()
	APP_URL: string;

	@Type(() => Number)
	@IsInt()
	@IsDefined()
	APP_VERSION: number;
}
