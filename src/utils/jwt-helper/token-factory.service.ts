import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
	IJwtModuleOptions,
	IToken,
	InviteToCourseJwtPayload,
	ResetJwtPasswordPayload
} from './resources/token.interface'
import { AccessToken } from './resources/access-token'
import { RefreshToken } from './resources/refresh-token'
import { TokenType } from './resources/token-type.enum'
import { VerifyEmailToken } from './resources/verify-email-token'
import { ResetPasswordToken } from './resources/reset-password-token'
import { InviteToCourseToken } from './resources/invite-to-course-token'
import { InviteToCoursePayload } from 'modules/course/dto/course.dto'

@Injectable()
export class TokenFactoryService {
	private token: IToken
	private tokenType: TokenType
	constructor(
		@Inject('JWT_OPTIONS') private options: IJwtModuleOptions,
		private jwtService: JwtService
	) {}
	createTokenInstance(type: TokenType): IToken {
		if (this.tokenType === type) {
			return this.token
		}
		switch (type) {
			case TokenType.ACCESS_TOKEN:
				this.token = new AccessToken(this.jwtService)
				this.token.setKeys(
					this.options.accessTokenPrivateKey,
					this.options.accessTokenPublicKey
				)
				this.token.setExpiresIn(this.options.accessTokenExpiresIn)
				break
			case TokenType.REFRESH_TOKEN:
				this.token = new RefreshToken(this.jwtService)
				this.token.setKeys(
					this.options.refreshTokenPrivateKey,
					this.options.refreshTokenPublicKey
				)
				this.token.setExpiresIn(this.options.refreshTokenExpiresIn)
				break
			case TokenType.VERIFY_EMAIL:
				this.token = new VerifyEmailToken(this.jwtService)
				this.token.setKeys(
					this.options.othersTokenPrivateKey,
					this.options.othersTokenPublicKey
				)
				this.token.setExpiresIn(this.options.otherTokenExpiresIn)
				break
			case TokenType.RESET_PASSWORD:
				this.token = new ResetPasswordToken(this.jwtService)
				this.token.setKeys(
					this.options.othersTokenPrivateKey,
					this.options.othersTokenPublicKey
				)
				this.token.setExpiresIn(this.options.otherTokenExpiresIn)
				break
			case TokenType.INVITE_TO_COURSE:
				this.token = new InviteToCourseToken(this.jwtService)
				this.token.setKeys(
					this.options.othersTokenPrivateKey,
					this.options.othersTokenPublicKey
				)
				this.token.setExpiresIn(this.options.otherTokenExpiresIn)
				break
			default:
				throw new Error('Invalid token type')
		}
		this.token.setJwtService(this.jwtService)
		return this.token
	}
	async verify<T>(token: string, type: TokenType): Promise<T> {
		this.createTokenInstance(type)
		return this.token.verify(token)
	}
	sign(
		payload:
			| CustomJwtPayload
			| ResetJwtPasswordPayload
			| InviteToCourseJwtPayload,
		type: TokenType
	): string {
		this.createTokenInstance(type)
		return this.token.sign(payload)
	}
	async decode<T>(token: string, type: TokenType): Promise<T> {
		this.createTokenInstance(type)
		return this.token.decode(token)
	}
}
