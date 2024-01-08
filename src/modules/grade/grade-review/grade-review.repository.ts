import { Injectable, Inject } from '@nestjs/common'
import { CreateGradeReviewRequest } from './resource/dto'
import { PrismaService } from '@my-prisma/prisma.service'
import { Prisma } from '@prisma/client'
@Injectable()
export class GradeReviewRepository {
	constructor(private prismaService: PrismaService) {}

	async getAllStudentGradeReview(params: {
		courseId: string
		studentId: string
	}) {
		const { courseId, studentId } = params
		const result = await this.prismaService.gradeReview.findMany({
			where: {
				courseId: courseId,
				studentId: studentId
			}
		})
		return result
	}

	async getAllGradeReview(courseId: string) {
		const result = await this.prismaService.gradeReview.findMany({
			where: {
				courseId: courseId
			}
		})
		return result
	}

	async createGradeReview(data: Prisma.GradeReviewCreateInput, tx?: any) {
		if (tx)
			return await tx.gradeReview.create({ data, include: { course: true } })
		else {
			const result = await this.prismaService.gradeReview.create({
				data: data,
				include: {
					course: true
				}
			})
			return result
		}
	}
}
