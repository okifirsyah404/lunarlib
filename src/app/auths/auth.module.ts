import { AccountEntity } from '@database/entities/users/account.entity';
import { ProfileEntity } from '@database/entities/users/profile.entity';
import { UserEntity } from '@database/entities/users/user.entity';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenStrategy } from 'src/infrastructures/strategies/access-token.strategy';
import { AppConfigService } from 'src/modules/app-config/providers/app-config.service';
import { AuthController } from './controllers/auth.controller';
import { AccountRepository } from './repositories/account.repository';
import { AuthService } from './services/auth.service';

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([AccountEntity, UserEntity, ProfileEntity]),
		JwtModule.registerAsync({
			inject: [AppConfigService],
			useFactory: (config: AppConfigService) => ({
				secret: config.jwtConfig.accessTokenSecret,
				signOptions: { expiresIn: config.jwtConfig.accessTokenExpiresIn },
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, AccountRepository, AccessTokenStrategy],
	exports: [AuthService, AccountRepository],
})
export class AuthModule {}
