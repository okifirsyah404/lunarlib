import { IUserEntity } from '@contract/entities/users/user.entity.interface';
import {
	createParamDecorator,
	ExecutionContext,
	NotFoundException,
} from '@nestjs/common';

export const GetUserLogged = createParamDecorator(
	(data, ctx: ExecutionContext): IUserEntity => {
		const user: IUserEntity = ctx.switchToHttp().getRequest().user;

		if (!user) {
			throw new NotFoundException('User not found in request context.');
		}

		return user;
	},
);
