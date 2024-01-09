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

	async getGradeReviewById(gradeReviewId: string) {
		const result = await this.prismaService.gradeReview.findUnique({
			where: {
				id: gradeReviewId
			},
			include: {
				user: true,
				comments: {
					include: {
						user: true
					}
				}
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

	async getAllGradeReviewInvolve(gradeReviewId: string) {
		const result = await this.prismaService.gradeReviewInvolve.findMany({
			where: {
				gradeReviewId: gradeReviewId
			},
			include: {
				user: true
			}
		})
		return result
	}
	async getIfUserInvolveInGradeReview(gradeReviewId: string, userId: string) {
		const result = await this.prismaService.gradeReviewInvolve.findFirst({
			where: {
				gradeReviewId: gradeReviewId,
				userId: userId
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

	async createCommentOnGradeReview(
		data: Prisma.GradeReviewCommentCreateInput,
		tx?: any
	) {
		if (tx) return await tx.gradeReviewComment.create({ data })
		else {
			const result = await this.prismaService.gradeReviewComment.create({
				data: data
			})
			return result
		}
	}

	async createGradeReviewInvolve(
		data: Prisma.GradeReviewInvolveCreateInput,
		tx?: any
	) {
		if (tx)
			return await tx.gradeReviewInvolve.create({
				data: data
			})
		else {
			const result = await this.prismaService.gradeReviewInvolve.create({
				data: data
			})
			return result
		}
	}
}
