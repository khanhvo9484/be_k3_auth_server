import { ManageTokenInCacheService } from './resources/utils/manage-token-in-cache'
import { plainToClass } from 'class-transformer'

import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import CreateUserRequest, {
	SignInRequest,
	UserResponse
} from '@user/dto/user.dto'
import { Cache } from 'cache-manager'
import { JwtPayloadDto } from '@shared/jwt.payload'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { UsersService } from '@user/user.service'
import { TokenFactoryService } from '@utils/jwt-helper/token-factory.service'
import { comparePassword, createHashPassword } from '@utils/password-helper'
import { TokenType } from '@utils/jwt-helper/resources/token-type.enum'
import {
	JWT_ACCESS_TOKEN_EXPIRATION_TIME,
	JWT_REFRESH_TOKEN_EXPIRATION_TIME
} from 'enviroment'
import { EmailSenderService } from '@utils/email-sender/email-sender.service'
import {
	EmailTemplateType,
	ResetPasswordPayload,
	VerifyEmailPayload
} from '@utils/email-sender/resources/email.interface'
import {
	ResetJwtPasswordPayload,
	VerifyEmailJwtPayload
} from '@utils/jwt-helper/resources/token.interface'
import {
	FE_RESET_PASSWORD_URL,
	FE_VERIFICATION_URL,
	PROTOCOL
} from 'enviroment'
import { buildResetPasswordLink } from '@utils/link-bulder'
@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		@Inject(CACHE_MANAGER) private cache: Cache,
		private tokenFactory: TokenFactoryService,
		private manageTokenInCacheService: ManageTokenInCacheService,
		private emailSenderService: EmailSenderService
	) {}
	async signUp(request: CreateUserRequest) {
		const password = request.password
		const hashPassword = await createHashPassword(password)
		request.password = hashPassword
		const result = await this.usersService.createUser(request)
		return result
	}
	async signIn(request: SignInRequest) {
		const user = await this.usersService.findUser({
			email: request.email
		})

		if (!user) {
			throw new BadRequestException('Invalid email or password')
		}
		if (user.isBlocked) {
			throw new BadRequestException('User is blocked')
		}
		const match = await comparePassword(request.password, user.password)
		if (!match) {
			throw new BadRequestException('Invalid email or password')
		}

		const payload: CustomJwtPayload = {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role
		}
		let token: string = await this.cache.get('access_token_' + user.email)
		if (!token) {
			token = this.tokenFactory
				.createTokenInstance(TokenType.ACCESS_TOKEN)
				.sign(payload)
			await this.cache.set('access_token_' + user.email, token, {
				ttl: parseInt(JWT_ACCESS_TOKEN_EXPIRATION_TIME)
			})
		}
		let refreshToken: string = await this.cache.get(
			'refresh_token_' + user.email
		)
		if (!refreshToken) {
			refreshToken = this.tokenFactory
				.createTokenInstance(TokenType.REFRESH_TOKEN)
				.sign(payload)
			await this.cache.set('refresh_token_' + user.email, refreshToken, {
				ttl: parseInt(JWT_REFRESH_TOKEN_EXPIRATION_TIME)
			})
		}
		const userResponse = plainToClass(UserResponse, user)
		return {
			access_token: token,
			user: userResponse,
			refresh_token: refreshToken
		}
	}
	async signOut(refreshToken: string): Promise<boolean> {
		const payload = await this.tokenFactory.verify<CustomJwtPayload>(
			refreshToken,
			TokenType.REFRESH_TOKEN
		)
		if (!payload) {
			throw new BadRequestException('Invalid refresh token')
		}
		const email = payload.email
		if (!email) {
			throw new BadRequestException('Invalid refresh token')
		}
		await this.cache.del('access_token_' + email)
		await this.cache.del('refresh_token_' + email)
		return true
	}

	async refreshToken(refreshToken: string) {
		const payload = await this.tokenFactory.verify<CustomJwtPayload>(
			refreshToken,
			TokenType.REFRESH_TOKEN
		)
		const email = payload.email
		if (!email) {
			throw new BadRequestException('Invalid refresh token 1')
		}
		const inStorageToken = await this.cache.get('refresh_token_' + email)
		if (!inStorageToken) {
			throw new BadRequestException('Invalid refresh token 2')
		}
		if (inStorageToken !== refreshToken) {
			throw new BadRequestException('Invalid refresh token 3')
		}
		const newPayload: CustomJwtPayload = {
			id: payload.id,
			email: payload.email,
			name: payload.name,
			role: payload.role
		}
		const newRefreshToken = this.tokenFactory.sign(
			newPayload,
			TokenType.REFRESH_TOKEN
		)
		const newAccessToken = this.tokenFactory.sign(
			newPayload,
			TokenType.ACCESS_TOKEN
		)
		await this.cache.set('access_token_' + email, newAccessToken, {
			ttl: parseInt(JWT_ACCESS_TOKEN_EXPIRATION_TIME)
		})
		await this.cache.set('refresh_token_' + email, newRefreshToken, {
			ttl: parseInt(JWT_REFRESH_TOKEN_EXPIRATION_TIME)
		})
		return {
			access_token: newAccessToken,
			refresh_token: newRefreshToken
		}
	}

	async validateUser(email: string) {
		const accessToken = await this.cache.get('access_token_' + email)
		if (accessToken) {
			return true
		}
		return false
	}

	async deleteUserSession(email: string) {
		await this.cache.del('access_token_' + email)
		await this.cache.del('refresh_token_' + email)
		return true
	}

	async sendEmailForgotPassword(email: string) {
		try {
			const resetPasswordPayload: ResetJwtPasswordPayload = {
				email: email
			}
			const resetPasswordToken = this.tokenFactory
				.createTokenInstance(TokenType.RESET_PASSWORD)
				.sign(resetPasswordPayload)

			const resetPasswordLink = buildResetPasswordLink(
				FE_RESET_PASSWORD_URL,
				resetPasswordToken,
				email
			)
			const result =
				await this.emailSenderService.sendWithTemplate<ResetPasswordPayload>({
					to: email,
					templateId: EmailTemplateType.RESET_PASSWORD,
					substitutionData: {
						reset_password_link: resetPasswordLink,
						protocol: PROTOCOL
					}
				})

			return result
		} catch (err) {
			console.log(err)
			throw new Error(err.message)
		}
	}

	async resetPassword(email: string, password: string) {
		if (!password) throw new BadRequestException('Password is required')
		if (!email) throw new BadRequestException('Email is required')

		const user = await this.usersService.findUser({
			email: email
		})
		if (!user) {
			throw new BadRequestException('Invalid email')
		}
		const hashPassword = await createHashPassword(password)
		await this.usersService.updateUser({
			where: { email },
			data: { password: hashPassword }
		})
		return {
			message: 'Reset password successfully'
		}
	}

	// verify reset password ----------------------------------------------
	async verifyResetPassword(email: string, token: string) {
		const payload = await this.tokenFactory
			.createTokenInstance(TokenType.RESET_PASSWORD)
			.verify<ResetJwtPasswordPayload>(token)
		if (!payload) {
			throw new BadRequestException('Invalid token')
		}
		return {
			data: payload,
			message: 'Verify reset password successfully'
		}
	}
	// end verify reset password ----------------------------------------------

	async activateAccount(email: string, token: string) {
		try {
			const payload = await this.tokenFactory
				.createTokenInstance(TokenType.VERIFY_EMAIL)
				.decode<VerifyEmailJwtPayload>(token)
			const result = await this.usersService.updateUser({
				where: { email },
				data: { isVerified: true }
			})
			return result
		} catch (err) {
			console.log(err)
			throw new BadRequestException('Invalid token')
		}
	}

	async sendVerifyEmail(email: string) {
		try {
			const payload: VerifyEmailJwtPayload = {
				email: email
			}
			const verifyEmailToken = this.tokenFactory
				.createTokenInstance(TokenType.VERIFY_EMAIL)
				.sign(payload)

			const verifyEmailLink = buildResetPasswordLink(
				FE_RESET_PASSWORD_URL,
				verifyEmailToken,
				email
			)
			const result =
				await this.emailSenderService.sendWithTemplate<VerifyEmailPayload>({
					to: email,
					templateId: EmailTemplateType.VERIFY_EMAIL,
					substitutionData: {
						verify_link: verifyEmailLink,
						protocol: PROTOCOL
					}
				})

			return result
		} catch (err) {
			console.log(err)
			throw new Error(err.message)
		}
	}
}

// 	generateToken(payload: payloadType, tokenType: string) {
// 		if (tokenType === 'access_token') {
// 			return this.jwtService.sign(payload, {
// 				secret: this.config.get<string>('JWT_SECRET'),
// 				expiresIn: parseInt(this.config.get<string>('JWT_EXPIRATION_TIME'))
// 			})
// 		}
// 		return this.jwtService.sign(payload, {
// 			secret: this.config.get<string>('JWT_REFRESH_SECRET'),
// 			expiresIn: parseInt(
// 				this.config.get<string>('JWT_REFRESH_EXPIRATION_TIME')
// 			)
// 		})
// 	}

// 	async setTokenToCache(token: string, email: string, tokenType: string) {
// 		if (tokenType === 'access_token') {
// 			await this.cache.set('access_token_' + email, token, {
// 				ttl: parseInt(this.config.get('JWT_EXPIRATION_TIME'))
// 			})
// 		} else {
// 			await this.cache.set('refresh_token_' + email, token, {
// 				ttl: parseInt(this.config.get('JWT_REFRESH_EXPIRATION_TIME'))
// 			})
// 		}
// 	}

// 		const result = await this.usersService.createUser(request)
// 		const verificationToken = await this.userTokenService.createUserToken(
// 			{
// 				email: result.email,
// 				subject: TokenType.ACTIVATE_ACCOUNT
// 			},
// 			result.id
// 		)

// 		const sendResult = await this.sendEmailService.sendVerificationEmail(
// 			result.email,
// 			verificationToken
// 		)

// 		const userResponse = plainToClass(UserResponse, result)
// 		return userResponse
// 	}

// 	async activateAccount(email: string, token: string) {
// 		await this.userTokenService.verifyUserToken(
// 			email,
// 			token,
// 			TokenType.ACTIVATE_ACCOUNT
// 		)
// 		await this.usersService.updateUser({
// 			where: { email },
// 			data: { isVerified: true }
// 		})
// 		await this.tokensService.setTokenUsed(token)
// 		return {
// 			message: 'Account activated successfully'
// 		}
// 	}

// 	// send reset password email ----------------------------------------------
// 	async forgotPassword(email: string) {
// 		const user = await this.usersService.findUser({
// 			email: email
// 		})
// 		if (!user) {
// 			throw new BadRequestException('Invalid email')
// 		}
// 		const resetPasswordToken = await this.userTokenService.createUserToken(
// 			{
// 				email: user.email,
// 				subject: TokenType.RESET_PASSWORD
// 			},
// 			user.id
// 		)
// 		await this.sendEmailService.sendResetPasswordEmail(
// 			email,
// 			resetPasswordToken
// 		)
// 		return {
// 			resetPasswordToken: resetPasswordToken
// 		}
// 	}
// 	// end send reset password email ----------------------------------------------

// 	// verify reset password ----------------------------------------------
// 	async verifyResetPassword(email: string, token: string) {
// 		await this.userTokenService.verifyUserToken(
// 			email,
// 			token,
// 			TokenType.RESET_PASSWORD
// 		)
// 		return {
// 			message: 'Verify reset password successfully'
// 		}
// 	}
// 	// end verify reset password ----------------------------------------------

// 	// reset password ----------------------------------------------
// 	async resetPassword(email: string, password: string) {
// 		if (!password) throw new BadRequestException('Password is required')
// 		if (!email) throw new BadRequestException('Email is required')

// 		const user = await this.usersService.findUser({
// 			email: email
// 		})
// 		if (!user) {
// 			throw new BadRequestException('Invalid email')
// 		}
// 		const salt = await bcrypt.genSalt()
// 		const hashPassword = await bcrypt.hash(password, salt)
// 		await this.usersService.updateUser({
// 			where: { email },
// 			data: { password: hashPassword }
// 		})
// 		return {
// 			message: 'Reset password successfully'
// 		}
// 	}

// 	// reset password ----------------------------------------------

// 	async logIn(request: SignInRequest) {
// 		const user = await this.usersService.findUser({
// 			email: request.email
// 		})
// 		if (!user) {
// 			throw new BadRequestException('Invalid email or password')
// 		}

// 		const match = await bcrypt.compare(request.password, user.password)
// 		if (!match) {
// 			throw new BadRequestException('Invalid email or password')
// 		}
// 		if (user.isVerified === false) {
// 			throw new BadRequestException('Please verify your email')
// 		}

// 		const payload: payloadType = {
// 			id: user.id,
// 			email: user.email,
// 			name: user.name,
// 			role: user.role
// 		}

// 		let token: string = await this.cache.get('access_token_' + user.email)
// 		if (!token) {
// 			token = this.generateToken(payload, 'access_token')
// 			await this.setTokenToCache(token, user.email, 'access_token')
// 		}

// 		let refreshToken: string = await this.cache.get(
// 			'refresh_token_' + user.email
// 		)
// 		if (!refreshToken) {
// 			refreshToken = this.generateToken(payload, 'refresh_token')

// 			await this.setTokenToCache(refreshToken, user.email, 'refresh_token')
// 		}

// 		const userResponse = plainToClass(UserResponse, user)
// 		return {
// 			access_token: token,
// 			user: userResponse,
// 			refresh_token: refreshToken
// 		}
// 	}
// 	async refreshToken(refreshToken: string) {
// 		let payload: payloadType
// 		try {
// 			payload = this.jwtService.verify(refreshToken, {
// 				secret: this.config.get<string>('JWT_REFRESH_SECRET')
// 			})
// 		} catch (err) {
// 			throw new BadRequestException('Invalid refresh token')
// 		}

// 		const email = payload['email']
// 		if (!email) {
// 			throw new BadRequestException('Invalid refresh token 1')
// 		}
// 		const inStorageToken = await this.cache.get('refresh_token_' + email)
// 		if (!inStorageToken) {
// 			throw new BadRequestException('Invalid refresh token 2')
// 		}
// 		if (inStorageToken !== refreshToken) {
// 			throw new BadRequestException('Invalid refresh token 3')
// 		}

// 		payload = {
// 			id: payload['id'],
// 			email: payload['email'],
// 			name: payload['name'],
// 			role: payload['role']
// 		}

// 		const newRefreshToken = this.generateToken(payload, 'refresh_token')
// 		const newAccessToken = this.generateToken(payload, 'access_token')

// 		await this.setTokenToCache(newAccessToken, email, 'access_token')
// 		await this.setTokenToCache(newRefreshToken, email, 'refresh_token')
// 		return {
// 			access_token: newAccessToken,
// 			refresh_token: newRefreshToken
// 		}
// 	}

// 	async signOut(refreshToken: string): Promise<boolean> {
// 		const payload: payloadType = this.jwtService.verify(refreshToken, {
// 			secret: this.config.get<string>('JWT_REFRESH_SECRET')
// 		})
// 		if (!payload.email) {
// 			throw new BadRequestException('Invalid refresh token')
// 		}
// 		const email: string = payload.email
// 		await this.cache.del('access_token_' + email)
// 		await this.cache.del('refresh_token_' + email)
// 		return true
// 	}

// 	async validateUser(authUser: IAuthUser) {
// 		const user = await this.usersService.findUser({
// 			email: authUser.email
// 		})

// 		if (user) return user

// 		const newUser = await this.usersService.createUser(authUser)

// 		return newUser
// 	}

// 	async authLogin(user: User) {
// 		const payload: payloadType = {
// 			id: user.id,
// 			email: user.email,
// 			name: user.name,
// 			role: user.role
// 		}

// 		let token: string = await this.cache.get('access_token_' + user.email)
// 		if (!token) {
// 			token = this.generateToken(payload, 'access_token')
// 			await this.setTokenToCache(token, user.email, 'access_token')
// 		}

// 		let refreshToken: string = await this.cache.get(
// 			'refresh_token_' + user.email
// 		)
// 		if (!refreshToken) {
// 			refreshToken = this.generateToken(payload, 'refresh_token')
// 			await this.setTokenToCache(refreshToken, user.email, 'refresh_token')
// 		}

// 		const userResponse = plainToClass(UserResponse, user)

// 		return {
// 			access_token: token,
// 			user: userResponse,
// 			refresh_token: refreshToken
// 		}
// 	}

// 	async verifyLoginByUserID(userId: string) {
// 		const key = 'user_oauth_' + userId
// 		const dataCache = await this.cache.get(key)
// 		await this.cache.del(key)

// 		return dataCache ? dataCache : ''
// 	}
// }
