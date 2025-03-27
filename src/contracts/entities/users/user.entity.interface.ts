import { IBaseEntity } from '../base.entity.interface';
import { IPostEntity } from '../posts/post.entity.interface';
import { IAccountEntity } from './account.entity.interface';
import { IProfileEntity } from './profile.entity.interface';

export interface IUserEntity extends IBaseEntity {
	username: string;
	accountId?: string;
	profileId?: string;
	account?: IAccountEntity;
	profile?: IProfileEntity;
	posts?: IPostEntity[];
}
