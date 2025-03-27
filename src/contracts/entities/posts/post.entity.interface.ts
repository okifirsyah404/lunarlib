import { IBaseEntity } from '../base.entity.interface';
import { IUserEntity } from '../users/user.entity.interface';
import { IBookEntity } from './book.entity.interface';

export interface IPostEntity extends IBaseEntity {
	image?: string;
	content: string;
	price: number;
	userId?: string;
	book?: IBookEntity;
	user?: IUserEntity;
}
