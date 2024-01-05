import { UserRepository } from './user.repository'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { DatabaseExecutionException } from 'common/exceptions'
import { IUsersService } from './user.interface'
@Injectable()
export class UsersService implements IUsersService {
	constructor(private userRepository: UserRepository) {}

	async findUser(
		userWhereUniqueInput: Prisma.UserWhereUniqueInput
	): Promise<User | null> {
		try {
			const result = await this.userRepository.findUser(userWhereUniqueInput)
			return result
		} catch (e: any) {
			throw new NotFoundException("Couldn't find user", 'E1276')
		}
	}
	async getAllUsers(params: {
		skip?: number
		take?: number
		cursor?: Prisma.UserWhereUniqueInput
		where?: Prisma.UserWhereInput
		orderBy?: Prisma.UserOrderByWithRelationInput
	}): Promise<User[]> {
		const { skip, take, cursor, where, orderBy } = params
		try {
			return await this.userRepository.getAllUsers({
				skip,
				take,
				cursor,
				where,
				orderBy
			})
		} catch (e: any) {
			throw new DatabaseExecutionException("Couldn't get users")
		}
	}

	async createUser(data: Prisma.UserCreateInput): Promise<User> {
		try {
			const result = await this.userRepository.createUser(data)
			return result
		} catch (e: any) {
			if (e.code === 'P2002') {
				throw new ConflictException('Email already exists')
			} else {
				throw new DatabaseExecutionException("Couldn't create user")
			}
		}
	}

	async updateUser(params: {
		where: Prisma.UserWhereUniqueInput
		data: Prisma.UserUpdateInput
	}): Promise<User> {
		const { where, data } = params
		try {
			const result = await this.userRepository.updateUser({ where, data })
			return result
		} catch (e: any) {
			throw new DatabaseExecutionException("Couldn't update user")
		}
	}

	async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
		try {
			const result = await this.userRepository.deleteUser(where)
			return result
		} catch (e: any) {
			throw new DatabaseExecutionException("Couldn't delete user")
		}
	}

	async updateUserOfficialId(params: {
		where: Prisma.UserWhereUniqueInput
		data: Prisma.UserUpdateInput
	}) {
		const { where, data } = params
		try {
			const result = await this.userRepository.updateUser({ where, data })
			return result
		} catch (e: any) {
			console.log(e)
			throw new DatabaseExecutionException("Couldn't update user")
		}
	}
}
