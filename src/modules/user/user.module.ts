import { Module } from '@nestjs/common'

import { UsersController } from './user.controller'
import { UsersService } from './user.service'
import { UserRepository } from './user.repository'
import { PrismaModule } from '@my-prisma/prisma.module'
@Module({
	imports: [],
	providers: [UserRepository, UsersService],
	controllers: [UsersController],
	exports: [UsersService, UserRepository]
})
export class UsersModule {}
