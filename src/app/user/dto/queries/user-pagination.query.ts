import { IPaginationQuery } from '@contract/responses/api.response';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UserPaginationQuery implements Partial<IPaginationQuery> {
	@Transform(({ value }) => {
		if (value === '') {
			return 1;
		}
		return Number(value);
	})
	@IsInt({})
	@IsOptional()
	page: number = 1;

	@Transform(({ value }) => {
		if (value === '') {
			return 10;
		}
		return Number(value);
	})
	@IsInt({})
	@IsOptional()
	limit: number = 10;

	@IsString({})
	@IsOptional()
	search?: string;
}
