import { Injectable } from '@nestjs/common'
import { PrismaService } from '@my-prisma/prisma.service'

@Injectable()
export class AdminRepository {
	constructor(private prismaService: PrismaService) {}

	async getAllUsers() {
		const result = await this.prismaService.user.findMany({
			where: {
				role: 'user'
			}
		})
		return result
	}
	async getUser(userId: string) {
		const result = await this.prismaService.user.findUnique({
			where: {
				id: userId
			}
		})
		return result
	}

	async getAllCourses() {
		const result = await this.prismaService.course.findMany({
			include: {
				courseOwner: true
			}
		})
		return result
	}

	async blockUser(userId: string) {
		const result = await this.prismaService.user.update({
			where: {
				id: userId
			},
			data: {
				isBlocked: true
			}
		})
		return result
	}
	async unBlockUser(userId: string) {
		const result = await this.prismaService.user.update({
			where: {
				id: userId
			},
			data: {
				isBlocked: false
			}
		})
		return result
	}

	async mapIdUser(userEmail: string, studentOfficialId: string) {
		const result = await this.prismaService.user.update({
			where: {
				email: userEmail
			},
			data: {
				studentOfficialId: studentOfficialId
			}
		})
		return result
	}
}
