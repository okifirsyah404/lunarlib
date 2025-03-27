import { dataSourceConfig } from '@database/configs/seed-typeorm.config';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './app/auths/auth.module';
import { PostModule } from './app/post/post.module';
import { ProfileModule } from './app/profiles/profile.module';
import { UserModule } from './app/user/user.module';
import { AppCacheModule } from './modules/app-cache/app-cache.module';
import { AppConfigModule } from './modules/app-config/app-config.module';
import { AppConfigService } from './modules/app-config/providers/app-config.service';
import { QueuesModule } from './modules/queues/queues.module';
import { S3StorageModule } from './modules/s3storage/s3storage.module';

@Module({
	imports: [
		// Core Modules
		AppConfigModule,
		AppCacheModule,
		TypeOrmModule.forRoot({
			...dataSourceConfig,
			autoLoadEntities: true,
		}),
		ThrottlerModule.forRootAsync({
			imports: [AppConfigModule],
			inject: [AppConfigService],
			useFactory: (appConfig: AppConfigService) => [
				{
					limit: appConfig.throttleConfig.limit,
					ttl: seconds(appConfig.throttleConfig.ttl),
					skipIf: (): boolean => !appConfig.throttleConfig.enable,
				},
			],
		}),
		HttpModule.register({
			global: true,
		}),
		BullModule.forRootAsync({
			imports: [AppConfigModule],
			inject: [AppConfigService],
			useFactory: (appConfig: AppConfigService) => ({
				redis: {
					host: appConfig.redisConfig.host,
					port: appConfig.redisConfig.port,
					db: 0,
				},
			}),
		}),
		QueuesModule,
		S3StorageModule.forRootAsync({
			imports: [AppConfigModule],
			inject: [AppConfigService],
			useFactory: (appConfig: AppConfigService) => {
				const s3Config = appConfig.s3Config;

				return {
					s3Options: {
						accessKeyId: s3Config.accessKeyId,
						secretAccessKey: s3Config.secretAccessKey,
						bucketName: s3Config.bucketName,
						endPoint: s3Config.endPoint,
						region: s3Config.region,
					},
				};
			},
		}),

		// Route Modules
		AuthModule,
		ProfileModule,
		PostModule,
		UserModule,
	],
})
export class AppModule {}
