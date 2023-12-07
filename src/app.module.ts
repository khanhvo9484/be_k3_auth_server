import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RedisCache } from 'config/cache/redis'
import { PrismaService } from 'prisma/prisma.service'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { HttpExceptionFilter } from 'common/filter/http-exception.filter'
import { UsersModule } from 'modules/user/user.module'
import { PrismaModule } from '@my-prisma/prisma.module'
import { TransformInterceptor } from '@common/interceptor/transform-reponse.interceptor'
import { AuthModule } from 'auth/auth.module'

@Module({
	imports: [
		CacheModule.registerAsync({
			isGlobal: true,
			useClass: RedisCache
		}),
		AuthModule,
		UsersModule,
		PrismaModule
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
		}
	]
})
export class AppModule {}
