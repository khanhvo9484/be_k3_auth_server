import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'

import { UsersModule } from '@user/user.module'
import { AuthService } from './auth.service'
import { AuthGuard } from '@common/guard/auth.guard'
import { OauthLoginService } from './oauth-login.service'
import { ManageTokenInCacheService } from './resources/utils/manage-token-in-cache'
import { GoogleStrategy } from './strategy/google.strategy'
import { FacebookStrategy } from './strategy/facebook.strategy'

import { BullModule } from '@nestjs/bull'
import { REDIS_URL } from '@enviroment/index'
@Module({
	imports: [JwtModule.register({}), UsersModule],
	providers: [
		AuthService,
		AuthGuard,
		OauthLoginService,
		ManageTokenInCacheService,
		GoogleStrategy,
		FacebookStrategy
	],
	controllers: [AuthController],
	exports: [AuthService]
})
export class AuthModule {}
