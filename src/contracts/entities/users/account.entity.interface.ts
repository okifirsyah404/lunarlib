import { RoleEnum } from '@contract/enums/role.enum';
import { IBaseEntity } from '../base.entity.interface';
import { IUserEntity } from './user.entity.interface';

export interface IAccountEntity extends IBaseEntity {
	email: string;
	password: string;
	role: RoleEnum;
	isActive: boolean;
	user?: IUserEntity;
}
