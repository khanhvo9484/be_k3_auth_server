import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'

import { UsersModule } from '@user/user.module'
import { AuthService } from './auth.service'
import { AuthGuard } from '@common/guard/auth.guard'

@Module({
	imports: [JwtModule.register({}), UsersModule],
	providers: [AuthService, AuthGuard],
	controllers: [AuthController],
	exports: []
})
export class AuthModule {}
