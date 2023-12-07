import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { IToken } from './resources/token.interface'
import { AccessToken } from './resources/access-token'
import { RefreshToken } from './resources/refresh-token'
import { TokenType } from './resources/token-type.enum'

@Injectable()
export class TokenFactoryService {
	constructor(private jwtService: JwtService) {}
	getTokenInstance(tokenType: string): IToken {
		switch (tokenType) {
			case TokenType.ACCESS_TOKEN:
				return new AccessToken(this.jwtService)
			case TokenType.REFRESH_TOKEN:
				return new RefreshToken(this.jwtService)
			default:
				return null
		}
	}
}
