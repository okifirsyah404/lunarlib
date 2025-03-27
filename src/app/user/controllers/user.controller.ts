import { IUserEntity } from '@contract/entities/users/user.entity.interface';
import { RoleEnum } from '@contract/enums/role.enum';
import {
	ApiResponse,
	ApiResponsePagination,
	IApiResponse,
	IApiResponsePagination,
} from '@contract/responses/api.response';
import {
	Body,
	Controller,
	Get,
	Param,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { GetUserLogged } from 'src/infrastructures/decorators/get-user-logged.decorator';
import { Roles } from 'src/infrastructures/decorators/role.decorator';
import { AccessTokenGuard } from 'src/infrastructures/guards/access-token.guard';
import { RoleGuard } from 'src/infrastructures/guards/role.guard';
import { UserPaginationQuery } from '../dto/queries/user-pagination.query';
import { UpdateUserActiveStatusRequest } from '../dto/requests/update-user-active-status.request';
import { UserService } from '../services/user.service';

@UseGuards(AccessTokenGuard)
@Controller('users')
export class UserController {
	constructor(private readonly service: UserService) {}

	@UseGuards(RoleGuard)
	@Roles(RoleEnum.ADMIN)
	@Get()
	async paginateUsers(
		@GetUserLogged() user: IUserEntity,
		@Query() reqQuery: UserPaginationQuery,
	): Promise<IApiResponsePagination<IUserEntity>> {
		const result = await this.service.paginateUsers(user.id!, reqQuery);

		return ApiResponsePagination.success({
			message: 'Retrieve users successfully',
			pagination: result.pagination,
			data: result.items,
		});
	}

	@UseGuards(RoleGuard)
	@Roles(RoleEnum.ADMIN)
	@Get(':userId')
	async getUserById(
		@Param('userId') userId: string,
	): Promise<IApiResponse<IUserEntity>> {
		const result = await this.service.getUserById(userId);

		return ApiResponse.success({
			message: 'Retrieve user successfully',
			data: result,
		});
	}

	@UseGuards(RoleGuard)
	@Roles(RoleEnum.ADMIN)
	@Put(':userId/active-status')
	async updateUserAccountActiveStatus(
		@Param('userId') userId: string,
		@Body() reqBody: UpdateUserActiveStatusRequest,
	): Promise<IApiResponse<IUserEntity>> {
		const result = await this.service.updateUserAccountActiveStatus(
			userId,
			reqBody.isActive,
		);

		return ApiResponse.success({
			message: 'Update user account active status successfully',
			data: result,
		});
	}
}
