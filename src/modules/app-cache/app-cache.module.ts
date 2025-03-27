import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import Keyv from 'keyv';
import moment from 'moment';
import { AppConfigModule } from '../app-config/app-config.module';
import { AppConfigService } from '../app-config/providers/app-config.service';
import { AppCacheService } from './providers/app-cache.service';

@Global()
@Module({
	imports: [
		AppConfigModule,
		CacheModule.registerAsync({
			isGlobal: true,
			imports: [AppConfigModule],
			inject: [AppConfigService],
			useFactory: (appConfig: AppConfigService) => {
				const ttl = moment
					.duration(appConfig.redisConfig.ttl, 'seconds')
					.asMilliseconds();

				return {
					stores: [
						new Keyv({
							store: new KeyvRedis({
								socket: {
									host: appConfig.redisConfig.host,
									port: appConfig.redisConfig.port,
								},
								database: 1,
							}),
						}),
					],
					ttl,
				};
			},
		}),
	],
	providers: [AppCacheService],
	exports: [AppCacheService],
})
export class AppCacheModule {}
