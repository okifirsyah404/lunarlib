import { BaseEntity } from '@contract/entities/base.entity';
import { IProfileEntity } from '@contract/entities/users/profile.entity.interface';
import { Column, Entity, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { IUserEntity } from '@contract/entities/users/user.entity.interface';

@Entity({ name: 'profiles' })
export class ProfileEntity extends BaseEntity implements IProfileEntity {
	@Column({})
	name: string;

	@Column({
		nullable: true,
	})
	image?: string;

	@Column({
		type: 'text',
		nullable: true,
	})
	bio?: string;

	@OneToOne(() => UserEntity, (user) => user.profile)
	user?: IUserEntity;
}
