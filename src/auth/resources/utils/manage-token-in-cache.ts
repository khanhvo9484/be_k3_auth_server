import { Inject } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { TokenType } from '@utils/jwt-helper/resources/token-type.enum'
export class ManageTokenInCacheService {
	constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}
	async setTokenInCache(
		data: { token: string; email: string },
		tokenType: TokenType,
		options?: { ttl: number }
	) {
		const { token, email } = data
		const inStorageToken = await this.cache.get(tokenType + '_' + email)
		if (inStorageToken) {
			return null
		}
		return await this.cache.set(tokenType + '_' + email, token, {
			ttl: options?.ttl
		})
	}
	async getTokenInCache(data: { email: string }, tokenType: TokenType) {
		return await this.cache.get(tokenType + '_' + data.email)
	}
	async deleteTokenInCache(data: { email: string }, tokenType: TokenType) {
		await this.cache.del(tokenType + '_' + data.email)
	}
}
