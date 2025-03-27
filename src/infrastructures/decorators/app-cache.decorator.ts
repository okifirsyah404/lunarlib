import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import moment from 'moment';
import { AppConfigLoaded } from 'src/modules/app-config/providers/app-config-loaded.util';

export const SetCache = <T>(
	cacheKey: ((...args: any[]) => string) | string,
	options?: { ttl?: number; unit?: moment.DurationInputArg2 },
): any => {
	const injectCacheManager = Inject(CACHE_MANAGER);

	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		injectCacheManager(target, 'cacheService');
		const originalMethod: (...args: any[]) => Promise<T> = descriptor.value;

		descriptor.value = async function (...args: any[]): Promise<T> {
			const redisConfig = await AppConfigLoaded.redisConfig();

			const ttl = moment
				.duration(options?.ttl ?? redisConfig.ttl, options?.unit ?? 'seconds')
				.asMilliseconds();

			const cacheService = (
				this as PropertyDescriptor & { cacheService: Cache }
			).cacheService;

			const keyBuilder =
				typeof cacheKey === 'function' ? cacheKey(...args) : cacheKey;

			const key = `${target.constructor.name}:${keyBuilder}`;

			const cacheValue: T | null = await cacheService.get(key);

			if (cacheValue) {
				return cacheValue;
			}

			const result: T = await originalMethod.apply(this, args);

			await cacheService.set(key, result, ttl);

			return result;
		};

		return descriptor;
	};
};

export const RefreshCache = <T>(
	cacheKey: ((...args: any[]) => string) | string,
	options?: { ttl?: number; unit?: moment.DurationInputArg2 },
): any => {
	const injectCacheManager = Inject(CACHE_MANAGER);

	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		injectCacheManager(target, 'cacheService');
		const originalMethod: (...args: any[]) => Promise<T> = descriptor.value;

		descriptor.value = async function (...args: any[]): Promise<T> {
			const redisConfig = await AppConfigLoaded.redisConfig();

			const ttl = moment
				.duration(options?.ttl ?? redisConfig.ttl, options?.unit ?? 'seconds')
				.asMilliseconds();

			const cacheService = (
				this as PropertyDescriptor & { cacheService: Cache }
			).cacheService;

			const keyBuilder =
				typeof cacheKey === 'function' ? cacheKey(...args) : cacheKey;

			const key = `${target.constructor.name}:${keyBuilder}`;

			await cacheService.del(key);

			const result: T = await originalMethod.apply(this, args);

			await cacheService.set(key, result, ttl);

			return result;
		};

		return descriptor;
	};
};

export const ClearCache = (
	cacheKey: ((...args: any[]) => string) | string,
): any => {
	const injectCacheManager = Inject(CACHE_MANAGER);

	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		injectCacheManager(target, 'cacheService');
		const originalMethod: (...args: any[]) => Promise<void> = descriptor.value;

		descriptor.value = async function (...args: any[]): Promise<void> {
			const cacheService = (
				this as PropertyDescriptor & { cacheService: Cache }
			).cacheService;

			const keyBuilder =
				typeof cacheKey === 'function' ? cacheKey(...args) : cacheKey;

			const key = `${target.constructor.name}:${keyBuilder}`;

			await cacheService.del(key);

			await originalMethod.apply(this, args);

			return;
		};

		return descriptor;
	};
};
