import { Module } from '@nestjs/common'

import { UsersController } from './user.controller'
import { UsersService } from './user.service'
import { UserRepository } from './user.repository'

@Module({
	imports: [],
	providers: [UserRepository, UsersService],
	controllers: [UsersController],
	exports: [UsersService, UserRepository]
})
export class UsersModule {}
