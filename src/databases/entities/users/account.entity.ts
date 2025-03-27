import { BaseEntity } from '@contract/entities/base.entity';
import { IAccountEntity } from '@contract/entities/users/account.entity.interface';
import { IUserEntity } from '@contract/entities/users/user.entity.interface';
import { RoleEnum } from '@contract/enums/role.enum';
import { Column, Entity, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'accounts' })
export class AccountEntity extends BaseEntity implements IAccountEntity {
	@Column({
		unique: true,
	})
	email: string;

	@Column({})
	password: string;

	@Column({
		type: 'enum',
		enum: RoleEnum,
		default: RoleEnum.MEMBER,
	})
	role: RoleEnum;

	@Column({
		default: false,
	})
	isActive: boolean;

	@OneToOne(() => UserEntity, (user) => user.account)
	user?: IUserEntity;
}
