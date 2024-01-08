import { Injectable } from '@nestjs/common'
import { PrismaService } from '@my-prisma/prisma.service'

@Injectable()
export class AdminRepository {
	constructor(private prismaService: PrismaService) {}

	async getAllUsers() {
		const result = await this.prismaService.user.findMany()
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
}
