import { TokenFactoryService } from './../utils/jwt-helper/token-factory.service'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'

import { UsersModule } from '@user/user.module'
import { AuthService } from './auth.service'
import { CustomJWTModule } from '@utils/jwt-helper/custom-jwt.module'
import {
	JWT_ACCESS_TOKEN_EXPIRATION_TIME,
	JWT_ACCESS_TOKEN_PRIVATE_KEY,
	JWT_ACCESS_TOKEN_PUBLIC_KEY,
	JWT_OTHERS_TOKEN_EXPIRATION_TIME,
	JWT_REFRESH_TOKEN_EXPIRATION_TIME,
	JWT_REFRESH_TOKEN_PRIVATE_KEY,
	JWT_REFRESH_TOKEN_PUBLIC_KEY
} from '../enviroment'
import { AuthGuard } from '@common/guard/auth.guard'

@Module({
	imports: [
		JwtModule.register({}),
		UsersModule,
		CustomJWTModule.register({
			accessTokenPrivateKey: JWT_ACCESS_TOKEN_PRIVATE_KEY,
			accessTokenPublicKey: JWT_ACCESS_TOKEN_PUBLIC_KEY,
			refreshTokenPrivateKey: JWT_REFRESH_TOKEN_PRIVATE_KEY,
			refreshTokenPublicKey: JWT_REFRESH_TOKEN_PUBLIC_KEY,

			accessTokenExpiresIn: parseInt(JWT_ACCESS_TOKEN_EXPIRATION_TIME),
			refreshTokenExpiresIn: parseInt(JWT_REFRESH_TOKEN_EXPIRATION_TIME),
			otherTokenExpiresIn: parseInt(JWT_OTHERS_TOKEN_EXPIRATION_TIME)
		})
	],
	providers: [AuthService, AuthGuard],
	controllers: [AuthController],
	exports: []
})
export class AuthModule {}
