import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { IPaginationQuery } from 'src/contracts/responses/api.response';

export class PostPaginationQuery implements Partial<IPaginationQuery> {
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
