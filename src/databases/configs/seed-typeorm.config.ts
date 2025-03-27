import InitialSeed from '@database/seeds/initial.seed';
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

expand(dotenv.config());

enum DatabaseProvider {
	MYSQL = 'mysql',
	MARIA_DB = 'mariadb',
	POSTGRES = 'postgres',
	SQLITE = 'sqlite',
	MONGO_DB = 'mongodb',
}

export const dataSourceConfig: DataSourceOptions & SeederOptions = {
	type:
		process.env.DB_PROVIDER !== undefined
			? DatabaseProvider[process.env.DB_PROVIDER.toUpperCase()]
			: DatabaseProvider.POSTGRES,
	host: process.env.DB_HOST ?? 'localhost',
	port: parseInt(process.env.DB_PORT ?? '5432'),
	username: process.env.DB_USERNAME ?? 'postgres',
	password: process.env.DB_PASSWORD ?? 'postgres',
	database: process.env.DB_NAME ?? '',
	ssl: process.env.DB_SSL === 'true',
	entities: [path.join(__dirname, '..', 'entities', '**', '*{.ts,.js}')],
	migrations: [path.join(__dirname, '..', 'migrations', '**', '*{.ts,.js}')],
	migrationsTableName: '__migrations',
	seeds: [InitialSeed],
	namingStrategy: new SnakeNamingStrategy(),
};

export const dataSource = new DataSource(dataSourceConfig);
