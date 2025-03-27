import { IUserEntity } from '@contract/entities/users/user.entity.interface';
import { IJwtPayload } from '@contract/jwts/jwt-payload.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccountRepository } from 'src/app/auths/repositories/account.repository';
import { AppConfigService } from 'src/modules/app-config/providers/app-config.service';
import { SetCache } from '../decorators/app-cache.decorator';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly config: AppConfigService,
		private readonly repository: AccountRepository,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.jwtConfig.accessTokenSecret,
		});
	}

	async validate(payload: IJwtPayload): Promise<IUserEntity> {
		return await this._validateUser(payload.sub);
	}

	@SetCache((userId: string) => `user-strategy:${userId}`, {
		ttl: 1,
		unit: 'minutes',
	})
	private async _validateUser(userId: string): Promise<IUserEntity> {
		const user = await this.repository.getUserById(userId);

		if (!user) {
			throw new UnauthorizedException('Pengguna tidak ditemukan');
		}

		return user;
	}
}
