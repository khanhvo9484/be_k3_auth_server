import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager'
import { REDIS_URL } from 'enviroment'

export class RedisCache implements CacheOptionsFactory {
	createCacheOptions():
		| CacheModuleOptions<Record<string, any>>
		| Promise<CacheModuleOptions<Record<string, any>>> {
		return {
			url: REDIS_URL
		}
	}
}
