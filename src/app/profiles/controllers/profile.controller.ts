import { IUserEntity } from '@contract/entities/users/user.entity.interface';
import { ApiResponse, IApiResponse } from '@contract/responses/api.response';
import { IUserResponse } from '@contract/responses/user.response';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUserLogged } from 'src/infrastructures/decorators/get-user-logged.decorator';
import { AccessTokenGuard } from 'src/infrastructures/guards/access-token.guard';
import { ProfileService } from '../services/profile.service';

@UseGuards(AccessTokenGuard)
@Controller('profiles')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get()
	async getProfile(
		@GetUserLogged() user: IUserEntity,
	): Promise<IApiResponse<IUserResponse>> {
		const result = await this.profileService.getUserById(user.id!);
		return ApiResponse.success({
			message: 'Get profile successfully',
			data: result,
		});
	}
}
