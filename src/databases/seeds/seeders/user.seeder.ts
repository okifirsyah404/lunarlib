/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { S3Client } from '@aws-sdk/client-s3';
import { RoleEnum } from '@contract/enums/role.enum';
import { AccountEntity } from '@database/entities/users/account.entity';
import { ProfileEntity } from '@database/entities/users/profile.entity';
import { UserEntity } from '@database/entities/users/user.entity';
import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as userRawData from '../../../../raw/datas/user.json';
import { downloadAndStoreToS3 } from '../helpers/axios-helper';
import { hashPassword } from '../helpers/hash-helper';
import { deleteObjectsAndDir } from '../helpers/s3.helper';

export async function userSeeder(
	dataSource: DataSource,
	s3: S3Client,
): Promise<void> {
	const logger = new Logger('UserSeeder');

	if (process.env.NODE_ENV === 'production') {
		logger.log('Skipping user seed in production...');
		return;
	}

	const queryRunner = dataSource.createQueryRunner();
	await queryRunner.connect();
	await queryRunner.startTransaction();

	try {
		await queryRunner.query('TRUNCATE "accounts" RESTART IDENTITY CASCADE;');
		await queryRunner.query('TRUNCATE "profiles" RESTART IDENTITY CASCADE;');
		await queryRunner.query('TRUNCATE "users" RESTART IDENTITY CASCADE;');

		await deleteObjectsAndDir(s3, 'users');

		const accountRepo = queryRunner.manager.getRepository(AccountEntity);
		const profileRepo = queryRunner.manager.getRepository(ProfileEntity);
		const userRepo = queryRunner.manager.getRepository(UserEntity);

		logger.log('Seeding user data...');

		const rawDatas: {
			email: string;
			username: string;
		}[] = userRawData.data;

		for (const rawData of rawDatas) {
			const { email, username } = rawData;

			const name = faker.person.fullName();
			const bio = faker.person.bio();

			const isActive = faker.datatype.boolean();

			const account = await accountRepo.insert({
				email,
				password: await hashPassword(email),
				role: username.includes('admin') ? RoleEnum.ADMIN : RoleEnum.MEMBER,
				isActive: username.includes('admin') ? true : isActive,
			});

			const profile = await profileRepo.insert({
				name,
				bio,
			});

			const user = await userRepo.insert({
				username,
				accountId: account.identifiers[0].id,
				profileId: profile.identifiers[0].id,
			});

			const image = await downloadAndStoreToS3(
				s3,
				`https://api.dicebear.com/9.x/notionists-neutral/png?seed=${username}?size=64`,
				'users',
				user.identifiers[0].id ?? '',
			);

			await profileRepo.update(profile.identifiers[0].id, {
				image,
			});
		}
		await queryRunner.commitTransaction();
		logger.log('User data seeded successfully!');
	} catch (error) {
		await queryRunner.rollbackTransaction();
		logger.error('There an error when seeding user data');
		throw error;
	} finally {
		await queryRunner.release();
	}
}
