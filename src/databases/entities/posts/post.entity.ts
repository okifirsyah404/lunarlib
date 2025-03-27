import { BaseEntity } from '@contract/entities/base.entity';
import { IBookEntity } from '@contract/entities/posts/book.entity.interface';
import { IPostEntity } from '@contract/entities/posts/post.entity.interface';
import { IUserEntity } from '@contract/entities/users/user.entity.interface';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { BookEntity } from './book.entity';

@Entity({ name: 'posts' })
export class PostEntity extends BaseEntity implements IPostEntity {
	@Column({
		type: 'text',
	})
	content: string;

	@Column()
	price: number;

	@Column({
		nullable: true,
	})
	image?: string;

	@Column({ type: 'uuid', nullable: true })
	userId?: string;

	@OneToOne(() => BookEntity, (book) => book.post)
	book?: IBookEntity;

	@ManyToOne(() => UserEntity, (user) => user.posts)
	@JoinColumn({ name: 'user_id' })
	user?: IUserEntity;
}
