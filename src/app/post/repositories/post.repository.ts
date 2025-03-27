import { IPostEntity } from '@contract/entities/posts/post.entity.interface';
import { ICreatePostRequest } from '@contract/requests/create-post.request.interface';
import { IPaginationResult } from '@contract/responses/api.response';
import { BookEntity } from '@database/entities/posts/book.entity';
import { PostEntity } from '@database/entities/posts/post.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationUtil } from '@util/pagination.util';
import { Brackets, Repository } from 'typeorm';
import { PostPaginationQuery } from '../dto/queries/post-pagination.query';

@Injectable()
export class PostRepository extends Repository<PostEntity> {
	private readonly logger = new Logger(PostRepository.name);
	private readonly targetName = this.repository.metadata.targetName;

	constructor(
		@InjectRepository(PostEntity)
		private readonly repository: Repository<PostEntity>,
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}

	async paginatePosts({
		page,
		limit,
		search,
	}: PostPaginationQuery): Promise<IPaginationResult<IPostEntity>> {
		const query = this.createQueryBuilder(this.targetName)
			.select([
				`${this.targetName}.id`,
				`${this.targetName}.content`,
				`${this.targetName}.image`,
				`${this.targetName}.price`,
				`${this.targetName}.createdAt`,
				`${this.targetName}.updatedAt`,
			])
			.addSelect(['user.id', 'user.username'])
			.addSelect(['profile.id', 'profile.name', 'profile.image', 'profile.bio'])
			.addSelect(['book.id', 'book.title', 'book.author']);

		query
			.leftJoin(`${this.targetName}.user`, 'user')
			.leftJoin('user.profile', 'profile')
			.leftJoin(`${this.targetName}.book`, 'book');

		if (search) {
			query.andWhere(
				new Brackets((qb) => {
					qb.where(`${this.targetName}.content ILIKE :search`, {
						search: `%${search}%`,
					})
						.orWhere('user.username ILIKE :search', { search: `%${search}%` })
						.orWhere('profile.name ILIKE :search', { search: `%${search}%` })
						.orWhere('book.title ILIKE :search', { search: `%${search}%` });
				}),
			);
		}

		query
			.orderBy(`${this.targetName}.createdAt`, 'DESC')
			.take(limit)
			.skip(PaginationUtil.countOffset({ page, limit }));

		const [items, total] = await query.getManyAndCount();

		return {
			pagination: {
				page,
				limit,
				total,
				totalPages: PaginationUtil.countTotalPages({
					totalItems: total,
					limit,
				}),
			},
			items: items,
		};
	}

	async getPostById(postId: string): Promise<IPostEntity | null> {
		return await this.repository.findOne({
			where: { id: postId },
			relations: {
				user: { profile: true },
				book: true,
			},
		});
	}

	async createPost(
		userId: string,
		data: ICreatePostRequest,
	): Promise<IPostEntity> {
		const queryRunner = this.repository.manager.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const post = queryRunner.manager.create(PostEntity, {
				content: data.postContent,
				price: data.postPrice,
				userId: userId,
			});
			await queryRunner.manager.save(post);

			const book = queryRunner.manager.create(BookEntity, {
				title: data.bookTitle,
				author: data.bookAuthor,
				isbn: data.bookISBN,
				language: data.bookLanguage,
				publisher: data.bookPublisher,
				publishYear: data.bookPublishYear,
				post: post,
			});
			await queryRunner.manager.save(book);
			await queryRunner.commitTransaction();

			const createdPost = await queryRunner.manager.findOne(PostEntity, {
				where: { id: post.id },
				relations: {
					user: { profile: true },
					book: true,
				},
			});

			return createdPost ?? post;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			this.logger.error(error);
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	async updatePostImage(
		postId: string,
		imageUrl: string,
	): Promise<PostEntity | null> {
		const queryRunner = this.repository.manager.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const post = await queryRunner.manager.findOneOrFail(PostEntity, {
				where: { id: postId },
			});

			await queryRunner.manager.update(PostEntity, postId, {
				image: imageUrl,
			});

			await queryRunner.commitTransaction();

			const updatedPost = await queryRunner.manager.findOne(PostEntity, {
				where: { id: post.id },
				relations: {
					user: { profile: true },
					book: true,
				},
			});

			return updatedPost ?? post;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			this.logger.error(error);
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	async updatePost(
		postId: string,
		data: Partial<ICreatePostRequest>,
	): Promise<PostEntity | null> {
		const queryRunner = this.repository.manager.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const post = await queryRunner.manager.findOneOrFail(PostEntity, {
				where: { id: postId },
			});
			const book = await queryRunner.manager.findOneOrFail(BookEntity, {
				where: { postId: postId },
			});

			await queryRunner.manager.update(PostEntity, postId, {
				content: data.postContent ?? post.content,
				price: data.postPrice ?? post.price,
			});

			await queryRunner.manager.update(
				BookEntity,
				{ post: post },
				{
					title: data.bookTitle ?? book.title,
					author: data.bookAuthor ?? book.author,
					isbn: data.bookISBN ?? book.isbn,
					language: data.bookLanguage ?? book.language,
					publisher: data.bookPublisher ?? book.publisher,
					publishYear: data.bookPublishYear ?? book.publishYear,
				},
			);

			await queryRunner.commitTransaction();

			const updatedPost = await queryRunner.manager.findOne(PostEntity, {
				where: { id: post.id },
				relations: {
					user: { profile: true },
					book: true,
				},
			});

			return updatedPost ?? post;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			this.logger.error(error);
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	async deletePost(postId: string): Promise<void> {
		const queryRunner = this.repository.manager.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			await queryRunner.manager.softDelete(BookEntity, { postId: postId });
			await queryRunner.manager.softDelete(PostEntity, { id: postId });
			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			this.logger.error(error);
			throw error;
		} finally {
			await queryRunner.release();
		}
	}
}
