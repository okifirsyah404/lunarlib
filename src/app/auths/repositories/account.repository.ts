import { IRegisterAuthRequest } from '@contract/requests/auth.request.interface';
import { AccountEntity } from '@database/entities/users/account.entity';
import { ProfileEntity } from '@database/entities/users/profile.entity';
import { UserEntity } from '@database/entities/users/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccountRepository extends Repository<AccountEntity> {
	private readonly logger = new Logger(AccountRepository.name);
	private readonly targetName = this.repository.metadata.targetName;

	constructor(
		@InjectRepository(AccountEntity)
		private readonly repository: Repository<AccountEntity>,
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}

	async getAccountByEmail(email: string): Promise<AccountEntity | null> {
		return await this.repository.findOne({
			where: {
				email,
			},
			relations: {
				user: {
					profile: true,
				},
			},
		});
	}

	async getAccountByEmailOrUsername(
		email: string,
		username: string,
	): Promise<AccountEntity | null> {
		return await this.repository.findOne({
			where: [
				{
					email,
				},
				{
					user: {
						username,
					},
				},
			],
			relations: {
				user: {
					profile: true,
				},
			},
		});
	}

	async getAccountById(id: string): Promise<AccountEntity | null> {
		return await this.repository.findOne({
			where: {
				id,
			},
			relations: {
				user: {
					profile: true,
				},
			},
		});
	}

	async getUserById(id: string): Promise<UserEntity | null> {
		return await this.repository.manager.findOne(UserEntity, {
			where: {
				id,
			},
			relations: {
				account: true,
				profile: true,
			},
		});
	}

	async createAccount(data: IRegisterAuthRequest): Promise<AccountEntity> {
		const queryRunner = this.repository.manager.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const account = queryRunner.manager.create(AccountEntity, {
				email: data.email,
				password: data.password,
			});
			await queryRunner.manager.save(account);

			const profile = queryRunner.manager.create(ProfileEntity, {
				name: data.name,
				bio: data.bio,
			});
			await queryRunner.manager.save(profile);

			const user = queryRunner.manager.create(UserEntity, {
				username: data.username,
				profile: profile,
				account: account,
			});
			await queryRunner.manager.save(user);

			const createdAccount = await queryRunner.manager.findOne(AccountEntity, {
				where: {
					id: account.id,
				},
				relations: {
					user: {
						profile: true,
					},
				},
			});

			await queryRunner.commitTransaction();

			return createdAccount ?? account;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			this.logger.error('Transaction failed', error);
			throw error;
		} finally {
			await queryRunner.release();
		}
	}

	async updateImageProfile(profileId: string, image: string): Promise<void> {
		await this.repository.manager.update(ProfileEntity, profileId, {
			image,
		});
		this.logger.log(`Updated image for profile ID: ${profileId}`);
	}
}
