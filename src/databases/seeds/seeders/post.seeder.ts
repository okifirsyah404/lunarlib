import { S3Client } from '@aws-sdk/client-s3';
import { BookEntity } from '@database/entities/posts/book.entity';
import { PostEntity } from '@database/entities/posts/post.entity';
import { UserEntity } from '@database/entities/users/user.entity';
import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { deleteObjectsAndDir, putObjectToS3 } from '../helpers/s3.helper';

export async function postSeeder(
	dataSource: DataSource,
	s3: S3Client,
): Promise<void> {
	const logger = new Logger('PostSeeder');

	if (process.env.NODE_ENV === 'production') {
		logger.log('Skipping post seed in production...');
		return;
	}

	logger.log('Seeding post data...');

	const queryRunner = dataSource.createQueryRunner();
	await queryRunner.connect();
	await queryRunner.startTransaction();

	try {
		await queryRunner.query('TRUNCATE "books" RESTART IDENTITY CASCADE;');
		await queryRunner.query('TRUNCATE "posts" RESTART IDENTITY CASCADE;');

		await deleteObjectsAndDir(s3, 'posts');

		const bookRepo = queryRunner.manager.getRepository(BookEntity);
		const postRepo = queryRunner.manager.getRepository(PostEntity);
		const userRepo = queryRunner.manager.getRepository(UserEntity);

		const users = await userRepo.find({
			select: {
				id: true,
				username: true,
			},
		});

		if (users.length < 2) {
			throw new Error('Not enough users to seed posts.');
		}

		const imagesDir = path.join(process.cwd(), 'raw', 'images');
		const images = fs.readdirSync(imagesDir);

		for (let i = 0; i < 50; i++) {
			const randUser = users[Math.floor(Math.random() * users.length)];

			let randSecondUser = users[Math.floor(Math.random() * users.length)];

			while (randUser.id === randSecondUser.id) {
				randSecondUser = users[Math.floor(Math.random() * users.length)];
			}
			const randomImage = images[Math.floor(Math.random() * images.length)];

			const post = postRepo.create({
				content: faker.lorem.paragraphs(3),
				price: faker.number.int({ min: 10000, max: 3000000, multipleOf: 500 }),
				user: randUser,
			});
			await postRepo.save(post);

			const book = bookRepo.create({
				title: faker.book.title(),
				author: faker.person.fullName(),
				publisher: faker.book.publisher(),
				publishYear: faker.date.past({ years: 20 }).getFullYear().toString(),
				isbn: faker.string.numeric(13),
				language: faker.location.language().name,
				post: post,
			});
			await bookRepo.save(book);

			const postImage = await putObjectToS3(
				s3,
				path.join(imagesDir, randomImage),
				`posts/${post.id}${path.extname(randomImage)}`,
			);

			post.image = postImage;
			await postRepo.save(post);
		}

		await queryRunner.commitTransaction();
		logger.log('Posts seeded successfully!');
	} catch (error) {
		await queryRunner.rollbackTransaction();
		logger.error('There was an error when seeding post data', error);
		throw error;
	} finally {
		await queryRunner.release();
	}
}
