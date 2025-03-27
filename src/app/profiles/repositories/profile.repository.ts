import { IUserResponse } from '@contract/responses/user.response';
import { UserEntity } from '@database/entities/users/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRepository } from 'src/app/auths/repositories/account.repository';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileRepository extends Repository<UserEntity> {
	private readonly logger = new Logger(AccountRepository.name);
	private readonly targetName = this.repository.metadata.targetName;

	constructor(
		@InjectRepository(UserEntity)
		private readonly repository: Repository<UserEntity>,
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}

	async getUserById(id: string): Promise<IUserResponse | null> {
		return await this.repository.findOne({
			where: {
				id,
			},
			relations: {
				profile: true,
				account: true,
			},
			select: {
				account: {
					id: true,
					email: true,
					role: true,
					isActive: true,
					password: false,
				},
			},
		});
	}
}
