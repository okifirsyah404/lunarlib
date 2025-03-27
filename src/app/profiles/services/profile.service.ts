import { IUserResponse } from '@contract/responses/user.response';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SetCache } from 'src/infrastructures/decorators/app-cache.decorator';
import { AppS3StorageService } from 'src/modules/s3storage/providers/app-s3storage.service';
import { ProfileRepository } from '../repositories/profile.repository';

@Injectable()
export class ProfileService {
	constructor(
		private readonly repository: ProfileRepository,
		private readonly s3StorageService: AppS3StorageService,
	) {}

	private readonly logger = new Logger(ProfileService.name);

	@SetCache<IUserResponse>((userId: string) => `user-profile:${userId}`, {
		ttl: 5,
		unit: 'minutes',
	})
	async getUserById(id: string): Promise<IUserResponse> {
		const user = await this.repository.getUserById(id);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (user.profile) {
			user.profile = await this.s3StorageService.getProfileSignedUrl(
				user.profile,
			);
		}

		return user;
	}
}
