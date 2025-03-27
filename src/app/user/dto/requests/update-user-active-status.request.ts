import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUserActiveStatusRequest {
	@IsBoolean()
	@IsNotEmpty()
	isActive: boolean;
}
