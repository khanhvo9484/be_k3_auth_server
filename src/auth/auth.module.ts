import { TokenFactoryService } from './../utils/jwt-helper/token-factory.service'
import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { CustomJWTModule } from '@utils/jwt-helper/custom-jwt.module'
@Module({
	imports: [JwtModule.register({}), CustomJWTModule.register({})],
	providers: [TokenFactoryService],
	controllers: [AuthController]
})
export class AuthModule {}
