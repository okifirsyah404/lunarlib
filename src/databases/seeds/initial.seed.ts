/* eslint-disable @typescript-eslint/no-unused-vars */
import { S3Client } from '@aws-sdk/client-s3';
import { userSeeder } from '@database/seeds/seeders/user.seeder';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { postSeeder } from './seeders/post.seeder';

expand(dotenv.config());

export default class InitialSeed implements Seeder {
	track?: boolean;
	logger = new Logger('Seeder');

	async run(
		dataSource: DataSource,
		factoryManager: SeederFactoryManager,
	): Promise<void> {
		try {
			const s3 = new S3Client({
				endpoint: process.env.S3_ENDPOINT!,
				region: process.env.S3_REGION!,
				credentials: {
					accessKeyId: process.env.S3_ACCESS_KEY_ID!,
					secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
				},
				forcePathStyle: true,
			});

			await userSeeder(dataSource, s3);
			await postSeeder(dataSource, s3);
		} catch (e) {
			this.logger.error(e);
		}
	}
}
