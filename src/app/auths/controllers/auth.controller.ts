import { ApiResponse, IApiResponse } from '@contract/responses/api.response';
import { IAuthResponse } from '@contract/responses/auth.response.interface';
import { Body, Controller, Post } from '@nestjs/common';
import {
	AuthBasicSignInRequest,
	AuthRegisterRequest,
} from '../dto/requests/auth.request';
import { AuthService } from '../services/auth.service';

@Controller('auths')
export class AuthController {
	constructor(private readonly service: AuthService) {}

	@Post('sign-in')
	async basicSignIn(
		@Body() reqBody: AuthBasicSignInRequest,
	): Promise<IApiResponse<IAuthResponse>> {
		const result = await this.service.basicSignIn(reqBody);

		return ApiResponse.success({
			message: 'Sign in successfully',
			data: result,
		});
	}

	@Post('sign-up')
	async register(
		@Body() reqBody: AuthRegisterRequest,
	): Promise<IApiResponse<IAuthResponse>> {
		const result = await this.service.register(reqBody);

		return ApiResponse.success({
			message: 'Sign up successfully',
			data: result,
		});
	}
}
