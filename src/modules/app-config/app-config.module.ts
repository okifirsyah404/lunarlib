import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './configs/app.config';
import { bcryptConfig } from './configs/bcrypt.config';
import { databaseConfig } from './configs/database.config';
import { jwtConfig } from './configs/jwt.config';
import { redisConfig } from './configs/redis.config';
import { s3Config } from './configs/s3.config';
import { throttleConfig } from './configs/throttle.config';
import { AppConfigService } from './providers/app-config.service';
import { validateConfig } from './validators/app-confing.validator';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			expandVariables: true,
			envFilePath: [
				'.env.local',
				'.env.development',
				'.env.staging',
				'.env.test',
				'.env.production',
				'.env',
			],
			load: [
				bcryptConfig,
				appConfig,
				jwtConfig,
				s3Config,
				redisConfig,
				throttleConfig,
				databaseConfig,
			],
			validate: validateConfig,
		}),
	],
	providers: [AppConfigService],
	exports: [AppConfigService],
})
export class AppConfigModule {}
