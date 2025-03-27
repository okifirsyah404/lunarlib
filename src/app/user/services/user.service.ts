import { IUserEntity } from '@contract/entities/users/user.entity.interface';
import { IPaginationResult } from '@contract/responses/api.response';
import {
	Injectable,
	Logger,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import {
	RefreshCache,
	SetCache,
} from 'src/infrastructures/decorators/app-cache.decorator';
import { AppS3StorageService } from 'src/modules/s3storage/providers/app-s3storage.service';
import { UserPaginationQuery } from '../dto/queries/user-pagination.query';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
	constructor(
		private readonly repository: UserRepository,
		private readonly appS3Storage: AppS3StorageService,
	) {}

	private readonly logger = new Logger(UserService.name);

	async paginateUsers(
		selfUserId: string,
		reqQuery: UserPaginationQuery,
	): Promise<IPaginationResult<IUserEntity>> {
		const result = await this.repository.paginateUsers(selfUserId, reqQuery);

		return {
			pagination: result.pagination,
			items: await Promise.all(
				result.items.map(async (item) => {
					if (item?.profile) {
						item.profile = await this.appS3Storage.getProfileSignedUrl(
							item?.profile,
						);
					}

					return item;
				}),
			),
		};
	}

	@SetCache<IUserEntity>((userId: string) => `user:${userId}`, {
		ttl: 60,
		unit: 'minutes',
	})
	async getUserById(userId: string): Promise<IUserEntity> {
		const user = await this.repository.getUserById(userId);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (user?.profile) {
			user.profile = await this.appS3Storage.getProfileSignedUrl(user?.profile);
		}

		return user;
	}

	@RefreshCache<IUserEntity>((userId: string) => `user:${userId}`, {
		ttl: 60,
		unit: 'minutes',
	})
	async updateUserAccountActiveStatus(
		userId: string,
		isActive: boolean,
	): Promise<IUserEntity> {
		const user = await this.repository.updateUserAccountActiveStatus(
			userId,
			isActive,
		);

		if (!user) {
			throw new UnprocessableEntityException('Failed to update user status');
		}

		if (user?.profile) {
			user.profile = await this.appS3Storage.getProfileSignedUrl(user?.profile);
		}

		return await this.repository.save(user);
	}
}
