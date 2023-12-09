import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'

import { UsersModule } from '@user/user.module'
import { AuthService } from './auth.service'
import { AuthGuard } from '@common/guard/auth.guard'
import { OauthLoginService } from './oauth-login.service'
import { ManageTokenInCacheService } from './resources/utils/manage-token-in-cache'

@Module({
	imports: [JwtModule.register({}), UsersModule],
	providers: [
		AuthService,
		AuthGuard,
		OauthLoginService,
		ManageTokenInCacheService
	],
	controllers: [AuthController],
	exports: []
})
export class AuthModule {}
