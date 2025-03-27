import { registerAs } from '@nestjs/config';
import { IsDefined, IsNumberString, IsString } from 'class-validator';

/**
 * Represents the configuration settings for a database connection.
 *
 * @typedef {Object} DatabaseConfig
 * @property {string} provider - The database provider (e.g., PostgreSQL, MySQL).
 * @property {string} host - The hostname or IP address of the database server.
 * @property {number} port - The port number on which the database server is listening.
 * @property {string} name - The name of the database.
 * @property {string} user - The username for authenticating with the database.
 * @property {string} password - The password for authenticating with the database.
 * @property {string} url - The full connection URL for the database.used for testing or migrations.
 */
export type DatabaseConfig = {
	provider: string;
	host: string;
	port: number;
	name: string;
	user: string;
	password: string;
	url: string;
};

/**
 * Configuration object for the database connection.
 *
 * This configuration is registered under the name 'databaseConfig' and provides
 * settings for connecting to a database.
 *
 * @returns {DatabaseConfig} The database configuration object.
 *
 * Properties:
 * - `provider`: The database provider (e.g., 'postgres', 'mysql'), erived from the `DB_PROVIDER` environment variable.
 * - `host`: The hostname or IP address of the database server, derived from the `DB_HOST` environment variable.
 * - `port`: The port number on which the database server is listening, derived from the `DB_PORT` environment variable.
 * - `name`: The name of the database, derived from the `DB_NAME` environment variable.
 * - `user`: The username for authenticating with the database, derived from the `DB_USERNAME` environment variable.
 * - `password`: The password for authenticating with the database, derived from the `DB_PASSWORD` environment variable.
 * - `url`: The full connection URL for the database, derived from the `DATABASE_URL` environment variable.
 *  If not provided, it will be undefined.
 */
export const databaseConfig = registerAs(
	'databaseConfig',
	(): DatabaseConfig => ({
		provider: process.env.DB_PROVIDER!,
		host: process.env.DB_HOST!,
		port: parseInt(process.env.DB_PORT!),
		name: process.env.DB_NAME!,
		user: process.env.DB_USERNAME!,
		password: process.env.DB_PASSWORD!,
		url: process.env.DATABASE_URL!,
	}),
);

/**
 * Class representing the environment variables for database configuration.
 *
 * @property {string} DB_PROVIDER - The database provider (e.g., 'postgres', 'mysql').
 * @property {string} DB_HOST - The hostname or IP address of the database server.
 * @property {string} DB_PORT - The port number on which the database server is listening.
 * @property {string} DB_NAME - The name of the database.
 * @property {string} DB_USERNAME - The username for authenticating with the database.
 * @property {string} DB_PASSWORD - The password for authenticating with the database.
 * @property {string} DATABASE_URL - The full connection URL for the database.
 */
export class DatabaseConfigEnvironmentVariables {
	@IsString()
	@IsDefined()
	DB_PROVIDER: string;

	@IsString()
	@IsDefined()
	DB_HOST: string;

	@IsNumberString()
	@IsDefined()
	DB_PORT: string;

	@IsString()
	@IsDefined()
	DB_NAME: string;

	@IsString()
	@IsDefined()
	DB_USERNAME: string;

	@IsString()
	@IsDefined()
	DB_PASSWORD: string;

	@IsString()
	@IsDefined()
	DATABASE_URL: string;
}
