import {
	IBasicAuthRequest,
	IRegisterAuthRequest,
} from '@contract/requests/auth.request.interface';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthBasicSignInRequest implements IBasicAuthRequest {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}

export class AuthRegisterRequest
	extends AuthBasicSignInRequest
	implements IRegisterAuthRequest
{
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsOptional()
	bio?: string;
}
