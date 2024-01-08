import { DatabaseExecutionException } from '@common/exceptions'
import { PrismaService } from '@my-prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CourseUtilService {
	constructor(private prismaService: PrismaService) {}

	async getCourseById(courseId: string) {
		try {
			const result = await this.prismaService.course.findUnique({
				where: {
					id: courseId
				}
			})
			return result
		} catch (error) {
			console.log(error)
			throw new DatabaseExecutionException(error.message)
		}
	}
}
