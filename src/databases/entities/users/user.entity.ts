import { BaseEntity } from '@contract/entities/base.entity';
import { IPostEntity } from '@contract/entities/posts/post.entity.interface';
import { IAccountEntity } from '@contract/entities/users/account.entity.interface';
import { IProfileEntity } from '@contract/entities/users/profile.entity.interface';
import { IUserEntity } from '@contract/entities/users/user.entity.interface';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { PostEntity } from '../posts/post.entity';
import { AccountEntity } from './account.entity';
import { ProfileEntity } from './profile.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity implements IUserEntity {
	@Column({
		unique: true,
	})
	username: string;

	@Column({ type: 'uuid', nullable: true })
	accountId?: string;

	@Column({ type: 'uuid', nullable: true })
	profileId?: string;

	@OneToOne(() => AccountEntity, (account) => account.user, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	account?: IAccountEntity;

	@OneToOne(() => ProfileEntity, (profile) => profile.user, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'profile_id' })
	profile?: IProfileEntity;

	@OneToMany(() => PostEntity, (post) => post.user, {
		onDelete: 'CASCADE',
	})
	posts?: IPostEntity[];
}
