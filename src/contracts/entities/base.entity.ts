import { IBaseEntity } from '@contract/entities/base.entity.interface';
import {
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

export class BaseEntity implements IBaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id?: string;

	@CreateDateColumn({
		type: 'timestamptz',
		nullable: true,
	})
	createdAt?: Date;

	@UpdateDateColumn({
		type: 'timestamptz',
		nullable: true,
	})
	updatedAt?: Date;

	@DeleteDateColumn({
		type: 'timestamptz',
		nullable: true,
	})
	deletedAt?: Date;
}
