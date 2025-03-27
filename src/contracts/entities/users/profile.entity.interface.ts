import { IBaseEntity } from '../base.entity.interface';
import { IUserEntity } from './user.entity.interface';

export interface IProfileEntity extends IBaseEntity {
	name: string;
	image?: string;
	bio?: string;
	user?: IUserEntity;
}
