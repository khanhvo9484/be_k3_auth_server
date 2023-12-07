import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Logger,
	NotFoundException,
	Param,
	Put,
	Req
} from '@nestjs/common'
import { UsersService } from './user.service'
import { UpdateUserRequest, UserResponse } from './dto/user.dto'
import { Request } from 'express'
import { plainToClass } from 'class-transformer'
import { DatabaseExecutionException } from '@common/exceptions'

@Controller('users')
export class UsersController {
	constructor(private userService: UsersService) {}
	@Get('/user/:id')
	async getUserById(@Param('id') id: string) {
		const numberId = parseInt(id)
		const result = await this.userService.findUser({
			id: numberId
		})
		if (!result) {
			throw new DatabaseExecutionException('User not found', 'E1276')
			// throw new NotFoundException('User not found', 'E1276')
		}
		return {
			message: 'Get user info',
			data: plainToClass(UserResponse, result)
		}
	}
	// @Put('/user')
	// async updateUser(@Req() request: Request, @Body() body: UpdateUserRequest) {
	// 	if (!request['user']) {
	// 		throw new BadRequestException('Invalid call')
	// 	}
	// 	if (!request['user'].id) {
	// 		throw new BadRequestException('Invalid call')
	// 	}
	// 	const userId = request['user'].id
	// 	const result = await this.userService.updateUser({
	// 		where: {
	// 			id: userId
	// 		},
	// 		data: body
	// 	})
	// 	return {
	// 		message: 'Update user info',
	// 		data: plainToClass(UserResponse, result)
	// 	}
	// }
}
