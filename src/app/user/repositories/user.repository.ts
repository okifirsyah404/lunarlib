import { IUserEntity } from '@contract/entities/users/user.entity.interface';
import { IPaginationResult } from '@contract/responses/api.response';
import { UserEntity } from '@database/entities/users/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationUtil } from '@util/pagination.util';
import { Repository } from 'typeorm';
import { UserPaginationQuery } from '../dto/queries/user-pagination.query';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
	private readonly logger = new Logger(UserRepository.name);
	private readonly targetName = this.repository.metadata.targetName;

	constructor(
		@InjectRepository(UserEntity)
		private readonly repository: Repository<UserEntity>,
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}

	async paginateUsers(
		selfUserId: string,
		{ page, limit, search }: UserPaginationQuery,
	): Promise<IPaginationResult<IUserEntity>> {
		const query = this.createQueryBuilder(this.targetName)
			.select([
				`${this.targetName}.id`,
				`${this.targetName}.username`,
				`${this.targetName}.createdAt`,
				`${this.targetName}.updatedAt`,
			])
			.addSelect(['profile.id', 'profile.name', 'profile.image', 'profile.bio'])
			.addSelect([
				'account.id',
				'account.email',
				'account.role',
				'account.isActive',
			]);

		query
			.leftJoin(`${this.targetName}.profile`, 'profile')
			.leftJoin(`${this.targetName}.account`, 'account');

		query.where(`${this.targetName}.id != :selfUserId`, {
			selfUserId,
		});

		if (search) {
			query.andWhere(
				`${this.targetName}.username ILIKE :search OR profile.name ILIKE :search`,
				{
					search: `%${search}%`,
				},
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

	async getUserById(userId: string): Promise<IUserEntity | null> {
		return await this.repository.findOne({
			where: { id: userId },
			relations: {
				profile: true,
				account: true,
			},
			select: {
				profile: {
					id: true,
					name: true,
					image: true,
					bio: true,
					createdAt: true,
					updatedAt: true,
					deletedAt: true,
				},
				account: {
					id: true,
					email: true,
					role: true,
					isActive: true,
					password: false,
					createdAt: true,
					updatedAt: true,
					deletedAt: true,
				},
			},
		});
	}

	async updateUserAccountActiveStatus(
		userId: string,
		isActive: boolean,
	): Promise<IUserEntity> {
		const queryRunner = this.repository.manager.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const user = await this.repository.findOneOrFail({
				where: { id: userId },
				relations: {
					account: true,
					profile: true,
				},
				select: {
					profile: {
						id: true,
						name: true,
						image: true,
						bio: true,
						createdAt: true,
						updatedAt: true,
						deletedAt: true,
					},
					account: {
						id: true,
						email: true,
						role: true,
						isActive: true,
						password: false,
						createdAt: true,
						updatedAt: true,
						deletedAt: true,
					},
				},
			});

			if (!user) {
				throw new Error('User not found');
			}

			if (!user.account) {
				throw new Error('User account not found');
			}
			user.account.isActive = isActive;

			await queryRunner.manager.save(user.account);
			await queryRunner.commitTransaction();

			return user;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			this.logger.error(error);
			throw error;
		} finally {
			await queryRunner.release();
		}
	}
}
