import { Prisma } from '@prisma/client'
import { CreateNotificationDto } from './../../../notification/resource/dto/request-response.dto'
import { NotificationService } from './../../../notification/notification.service'
import { plainToClass } from 'class-transformer'

import { CourseService } from 'modules/course/course.service'
import { GradeReviewRepository } from './grade-review.repository'
import { Injectable } from '@nestjs/common'
import { IGradeReview } from '../resource/shemas'
import { CreateGradeReviewRequest, GradeReviewResponse } from './resource/dto'
import { DatabaseExecutionException } from '@common/exceptions'
import { FileUploaderService } from '@utils/file-uploader/file-uploader.service'
import { NotificationType } from 'notification/resource/enum'
import { PrismaService } from '@my-prisma/prisma.service'
@Injectable()
export class GradeReviewService {
	constructor(
		private gradeReviewRepository: GradeReviewRepository,
		private courseService: CourseService,
		private fileUploaderService: FileUploaderService,
		private notificationService: NotificationService,
		private prismaService: PrismaService
	) {}

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
				console.log(createNotificationDto)
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
}
