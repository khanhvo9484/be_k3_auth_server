import { Prisma, User } from '@prisma/client'
export interface IUsersService {
	findUser(
		userWhereUniqueInput: Prisma.UserWhereUniqueInput
	): Promise<User | null>
	getAllUsers(params: {
		skip?: number
		take?: number
		cursor?: Prisma.UserWhereUniqueInput
		where?: Prisma.UserWhereInput
		orderBy?: Prisma.UserOrderByWithRelationInput
	}): Promise<User[]>

	createUser(data: Prisma.UserCreateInput): Promise<User | null>
	updateUser(params: {
		where: Prisma.UserWhereUniqueInput
		data: Prisma.UserUpdateInput
	}): Promise<User>

	deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User | null>
}
