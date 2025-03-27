/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IUserEntity } from '@contract/entities/users/user.entity.interface';
import { RoleEnum } from '@contract/enums/role.enum';
import {
	ExecutionContext,
	Inject,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccountRepository } from 'src/app/auths/repositories/account.repository';

/**
 * RoleGuard is a guard class that handles all the role authorization for the user.
 *
 * This class used in UseGuards decorator in the controller.
 *
 * This class should used after AuthGuard in UseGuards params order.
 */
@Injectable()
export class RoleGuard {
	constructor(
		@Inject(AccountRepository)
		private readonly accountService: AccountRepository,
		private readonly reflector: Reflector,
	) {}

	private readonly logger = new Logger(RoleGuard.name);

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.get<RoleEnum[]>('roles', context.getHandler());

		if (!roles) {
			return true;
		}
		const user: IUserEntity = context.switchToHttp().getRequest().user;

		const account = user?.account;

		if (!account) {
			throw new UnauthorizedException('Account not found');
		}

		const isMatchRole = this.matchRoles(roles, account?.role);

		if (!isMatchRole || !account.isActive) {
			throw new UnauthorizedException(
				'You did not have permission to access this resource',
			);
		}

		return isMatchRole;
	}

	matchRoles(roles: RoleEnum[], role: RoleEnum | undefined): boolean {
		if (!role) {
			return false;
		}

		return roles.some((_role) => _role === role);
	}
}
