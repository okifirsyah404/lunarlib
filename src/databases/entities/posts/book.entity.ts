import { BaseEntity } from '@contract/entities/base.entity';
import { IBookEntity } from '@contract/entities/posts/book.entity.interface';
import { IPostEntity } from '@contract/entities/posts/post.entity.interface';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { PostEntity } from '../posts/post.entity';

@Entity({ name: 'books' })
export class BookEntity extends BaseEntity implements IBookEntity {
	@Column()
	title: string;

	@Column()
	author: string;

	@Column({
		nullable: true,
	})
	publisher?: string;

	@Column({
		nullable: true,
	})
	publishYear?: string;

	@Column({
		nullable: true,
	})
	isbn?: string;

	@Column({
		nullable: true,
	})
	language?: string;

	@Column({ type: 'uuid', nullable: true })
	postId?: string;

	@OneToOne(() => PostEntity, (post) => post.book)
	@JoinColumn({ name: 'post_id' })
	post?: IPostEntity;
}
