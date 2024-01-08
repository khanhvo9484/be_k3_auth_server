import { Prisma } from '@prisma/client'
import { CreateNotificationDto } from './../../../notification/resource/dto/request-response.dto'
import { NotificationService } from './../../../notification/notification.service'
import { plainToClass } from 'class-transformer'

import { CourseService } from 'modules/course/course.service'
import { GradeReviewRepository } from './grade-review.repository'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { IGradeReview } from '../resource/shemas'
import {
	CreateCommentOnGradeReviewRequest,
	CreateGradeReviewRequest,
	GradeReviewResponse
} from './resource/dto'
import { DatabaseExecutionException } from '@common/exceptions'
import { FileUploaderService } from '@utils/file-uploader/file-uploader.service'
import { NotificationType } from 'notification/resource/enum'
import { PrismaService } from '@my-prisma/prisma.service'
import { CourseUtilService } from 'modules/course-util/course-util.service'
@Injectable()
export class GradeReviewService {
	constructor(
		private gradeReviewRepository: GradeReviewRepository,
		private courseUtilService: CourseUtilService,
		private fileUploaderService: FileUploaderService,
		private notificationService: NotificationService,
		private prismaService: PrismaService
	) {}

	async getGradeReview(gradeReviewId: string) {
		try {
			const result =
				await this.gradeReviewRepository.getGradeReviewById(gradeReviewId)
			return result
		} catch (error) {
			console.log(error)
			throw new DatabaseExecutionException(error.message)
		}
	}

	async getAllGradeReview(
		user: CustomJwtPayload,
		courseId: string,
		roleInCourse: string
	) {
		try {
			let result: any
			if (roleInCourse === 'student') {
				result = await this.gradeReviewRepository.getAllStudentGradeReview({
					courseId: courseId,
					studentId: user.id
				})
			} else {
				result = await this.gradeReviewRepository.getAllGradeReview(courseId)
				return result
			}
			if (!result) {
				throw new Error('not found')
			} else {
				return result
			}
		} catch (error) {
			console.log(error)
			throw new DatabaseExecutionException(error.message)
		}
	}

	async createGradeReview(request: CreateGradeReviewRequest, file: any) {
		try {
			if (file) {
				const result = await this.fileUploaderService.uploadFile(file)
				request.imgURL = result
			}
			const studentId = request.studentId
			const courseId = request.courseId
			const requestWithoutStudentId = {
				...request,
				studentId: undefined,
				courseId: undefined
			}
			const results = await this.prismaService.$transaction(async (prisma) => {
				const result = await this.gradeReviewRepository.createGradeReview(
					{
						...requestWithoutStudentId,
						user: {
							connect: {
								id: studentId
							}
						},
						course: {
							connect: {
								id: courseId
							}
						}
					},
					prisma
				)

				const createNotificationDto = new CreateNotificationDto({
					type: NotificationType.NEW_GRADE_REVIEW,
					content: `đã tạo đơn phúc khảo cho ${result.course.name}`,
					title: 'Tạo đơn phúc khảo',
					targetId: result.id,
					actorId: studentId,
					userId: result.course.teacherId
				})

				const notifications =
					await this.notificationService.createNotificationForTeacher({
						courseId: courseId,
						notification: createNotificationDto,
						tx: prisma
					})

				return result
			})

			return results
		} catch (error) {
			console.log(error)
			throw new DatabaseExecutionException(error.message)
		}
	}

	async commentOnGradeReview(request: CreateCommentOnGradeReviewRequest) {
		try {
			const userId = request.userId
			const gradeReviewId = request.gradeReviewId
			const requestWithoutId = {
				...request,
				userId: undefined,
				gradeReviewId: undefined
			}
			const role = await this.courseUtilService.getRoleInCourse(
				request.courseId,
				userId
			)
			const result =
				await this.gradeReviewRepository.createCommentOnGradeReview({
					...requestWithoutId,
					user: {
						connect: {
							id: request.userId
						}
					},
					gradeReview: {
						connect: {
							id: request.gradeReviewId
						}
					}
				})
			const createNotificationDto = new CreateNotificationDto({
				type: NotificationType.NEW_GRADE_REVIEW_COMMENT,
				content: `đã bình luận về đơn phúc khảo của bạn`,
				title: 'Bình luận mới',
				targetId: result.id,
				actorId: userId
			})
			return result
		} catch (error) {
			console.log(error)
			throw new DatabaseExecutionException(error.message)
		}
	}
}
