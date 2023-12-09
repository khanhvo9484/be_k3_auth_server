import { TokenFactoryService } from './../utils/jwt-helper/token-factory.service'
import { Inject, Injectable } from '@nestjs/common'
import { UsersService } from '@user/user.service'
import { IAuthUser } from './resources/interface'
import { generateId } from '@utils/id-helper'
import { User } from '@prisma/client'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { TokenType } from '@utils/jwt-helper/resources/token-type.enum'
import { plainToClass } from 'class-transformer'
import { UserResponse } from '@user/dto/user.dto'
import {
	JWT_ACCESS_TOKEN_EXPIRATION_TIME,
	JWT_REFRESH_TOKEN_EXPIRATION_TIME
} from '@enviroment/index'
@Injectable()
export class OauthLoginService {
	constructor(
		private usersService: UsersService,
		@Inject(CACHE_MANAGER) private cache: Cache,
		private tokenFactoryService: TokenFactoryService
	) {}
	async validateUser(authUser: IAuthUser) {
		const user = await this.usersService.findUser({
			email: authUser.email
		})
		if (user) return user
		const newUser = await this.usersService.createUser(authUser)
		return newUser
	}
	async authLogin(user: User) {
		const payload: CustomJwtPayload = {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role
		}

		let token: string = await this.cache.get('access_token_' + user.email)
		if (!token) {
			token = this.tokenFactoryService.sign(payload, TokenType.ACCESS_TOKEN)
			await this.cache.set('access_token_' + user.email, token, {
				ttl: parseInt(JWT_ACCESS_TOKEN_EXPIRATION_TIME)
			})
		}

		let refreshToken: string = await this.cache.get(
			'refresh_token_' + user.email
		)
		if (!refreshToken) {
			refreshToken = this.tokenFactoryService.sign(
				payload,
				TokenType.REFRESH_TOKEN
			)
			await this.cache.set('refresh_token_' + user.email, token, {
				ttl: parseInt(JWT_REFRESH_TOKEN_EXPIRATION_TIME)
			})
		}

		const userResponse = plainToClass(UserResponse, user)
		const data = {
			access_token: token,
			user: userResponse,
			refresh_token: refreshToken
		}
		await this.cache.set('user_oauth_' + user.id, data)
		return data
	}
	async verifyLoginByUserID(userID: string) {
		const data = await this.cache.get('user_oauth_' + userID)
		if (!data) return null
		await this.cache.del('user_oauth_' + userID)
		return data
	}
}
