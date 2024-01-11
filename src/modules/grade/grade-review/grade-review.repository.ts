import { Injectable, Inject } from '@nestjs/common'
import { CreateGradeReviewRequest } from './resource/dto'
import { PrismaService } from '@my-prisma/prisma.service'
import { GradeReview, Prisma } from '@prisma/client'
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
			},
			include: {
				user: true,
				final: true
			},
			orderBy: {
				createdAt: 'desc'
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
					},
					orderBy: {
						createdAt: 'asc'
					}
				},
				final: {
					include: {
						reviewer: true
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
			},
			include: {
				user: true,
				final: true
			},
			orderBy: {
				createdAt: 'desc'
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
				data: data,
				include: {
					user: true,
					gradeReview: true
				}
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

	async setStatusForGradeReview(
		id: string,
		status: string,
		tx?: any
	): Promise<GradeReview> {
		if (tx)
			return await tx.gradeReview.update({
				where: {
					id: id
				},
				data: {
					status: status
				}
			})
		else {
			const result = await this.prismaService.gradeReview.update({
				where: {
					id: id
				},
				data: {
					status: status
				}
			})
			return result
		}
	}
}
