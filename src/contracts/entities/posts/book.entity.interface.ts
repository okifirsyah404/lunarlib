import { IBaseEntity } from '../base.entity.interface';
import { IPostEntity } from '../posts/post.entity.interface';

export interface IBookEntity extends IBaseEntity {
	title: string;
	author: string;
	publisher?: string;
	publishYear?: string;
	isbn?: string;
	language?: string;
	postId?: string;
	post?: IPostEntity;
}
