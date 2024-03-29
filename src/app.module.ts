import { CacheModule, CacheStore } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RedisCache } from 'config/cache/redis'
import { PrismaService } from 'prisma/prisma.service'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { HttpExceptionFilter } from 'common/filter/http-exception.filter'
import { UsersModule } from 'modules/user/user.module'
import { PrismaModule } from '@my-prisma/prisma.module'
import { TransformInterceptor } from '@common/interceptor/transform-reponse.interceptor'
import { AuthModule } from 'auth/auth.module'
import {
	JWT_ACCESS_TOKEN_EXPIRATION_TIME,
	JWT_ACCESS_TOKEN_PRIVATE_KEY,
	JWT_ACCESS_TOKEN_PUBLIC_KEY,
	JWT_OTHERS_TOKEN_EXPIRATION_TIME,
	JWT_OTHERS_TOKEN_PRIVATE_KEY,
	JWT_OTHERS_TOKEN_PUBLIC_KEY,
	JWT_REFRESH_TOKEN_EXPIRATION_TIME,
	JWT_REFRESH_TOKEN_PRIVATE_KEY,
	JWT_REFRESH_TOKEN_PUBLIC_KEY,
	REDIS_URL
} from 'enviroment'
import { redisStore } from 'cache-manager-redis-store'
import { AuthGuard } from '@common/guard/auth.guard'
import { CustomJWTModule } from '@utils/jwt-helper/custom-jwt.module'
import { CourseModule } from 'modules/course/course.module'
import { EmailSenderModule } from '@utils/email-sender/email-sender.module'
import { GradeModule } from 'modules/grade/grade.module'
import { GatewayModule } from 'socket/gateway.module'
import { NotificationModule } from 'notification/notification.module'
import { ExcelModule } from '@utils/excel/excel.module'
import { StudentGradeModule } from 'modules/grade/student-grade-upload/student-grade.module'
import { FileUploaderModule } from '@utils/file-uploader/file-uploader.module'
import { AdminModule } from 'admin/admin.module'

@Module({
	imports: [
		CacheModule.registerAsync({
			isGlobal: true,
			useFactory: async () => {
				const store = await redisStore({
					url: REDIS_URL,
					store: 'memory',
					pingInterval: 10000
				})
				return {
					store: store as unknown as CacheStore
				}
			}
		}),
		CustomJWTModule.register({
			isGlobal: true,

			accessTokenPrivateKey: JWT_ACCESS_TOKEN_PRIVATE_KEY,
			accessTokenPublicKey: JWT_ACCESS_TOKEN_PUBLIC_KEY,
			refreshTokenPrivateKey: JWT_REFRESH_TOKEN_PRIVATE_KEY,
			refreshTokenPublicKey: JWT_REFRESH_TOKEN_PUBLIC_KEY,
			othersTokenPrivateKey: JWT_OTHERS_TOKEN_PRIVATE_KEY,
			othersTokenPublicKey: JWT_OTHERS_TOKEN_PUBLIC_KEY,

			accessTokenExpiresIn: parseInt(JWT_ACCESS_TOKEN_EXPIRATION_TIME),
			refreshTokenExpiresIn: parseInt(JWT_REFRESH_TOKEN_EXPIRATION_TIME),
			otherTokenExpiresIn: parseInt(JWT_OTHERS_TOKEN_EXPIRATION_TIME)
		}),
		EmailSenderModule.register({
			isGlobal: true
		}),
		AuthModule,
		UsersModule,
		CourseModule,
		PrismaModule,
		GradeModule,
		GatewayModule,
		NotificationModule,
		ExcelModule,
		FileUploaderModule,
		AdminModule
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor
		},
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		}
	]
})
export class AppModule {}
