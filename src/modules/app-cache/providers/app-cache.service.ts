import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import moment from 'moment/moment';
import { AppConfigService } from 'src/modules/app-config/providers/app-config.service';

@Injectable()
export class AppCacheService {
	constructor(
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
		private readonly config: AppConfigService,
	) {}

	async set<T>(
		key: string,
		value: T,
		options?: {
			ttl?: number;
			unit?: moment.DurationInputArg2;
		},
	): Promise<void> {
		const ttl = moment
			.duration(
				options?.ttl ?? this.config.redisConfig.ttl,
				options?.unit ?? 'seconds',
			)
			.asMilliseconds();

		await this.cacheManager.set(key, value, ttl);
	}

	async setBuilder<T>(
		keyBuilder: (...args: any[]) => string,
		value: T,
		options?: {
			ttl?: number;
			unit?: moment.DurationInputArg2;
		},
	): Promise<void> {
		await this.set(keyBuilder(value), value, options);
	}

	async get<T>(key: string): Promise<T | null> {
		return this.cacheManager.get(key);
	}

	async delete(key: string): Promise<void> {
		await this.cacheManager.del(key);
	}
}
