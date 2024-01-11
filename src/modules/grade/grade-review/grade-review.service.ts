import { CreateNotificationDto } from './../../../notification/resource/dto/request-response.dto'
import { NotificationService } from './../../../notification/notification.service'

import { CourseService } from 'modules/course/course.service'
import { GradeReviewRepository } from './grade-review.repository'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import {
	AcceptGradeReviewRequest,
	CreateCommentOnGradeReviewRequest,
	CreateGradeReviewRequest,
	GradeReviewResponse,
	RejectGradeReviewRequest
} from './resource/dto'
import { DatabaseExecutionException } from '@common/exceptions'
import { FileUploaderService } from '@utils/file-uploader/file-uploader.service'
import { NotificationType } from 'notification/resource/enum'
import { PrismaService } from '@my-prisma/prisma.service'
import { CourseUtilService } from 'modules/course-util/course-util.service'
import { GradeReviewStatus } from '../resource/enum'
import { StudentGradeService } from '../student-grade-upload/student-grade.service'
@Injectable()
export class GradeReviewService {
	constructor(
		private gradeReviewRepository: GradeReviewRepository,
		private courseUtilService: CourseUtilService,
		private fileUploaderService: FileUploaderService,
		private notificationService: NotificationService,
		private prismaService: PrismaService,
		private studentGradeService: StudentGradeService
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

	async acceptGradeReview(request: AcceptGradeReviewRequest) {
		try {
			const gradeReview = await this.prismaService.gradeReview.findUnique({
				where: {
					id: request.gradeReviewId
				}
			})
			const student = await this.prismaService.user.findUnique({
				where: {
					id: gradeReview.studentId
				}
			})

			const data = {
				courseId: gradeReview.courseId,
				studentOfficialId: student.studentOfficialId,
				grade: request.finalGrade,
				gradeId: gradeReview.gradeId
			}
			console.log(data)
			const updateResult =
				await this.studentGradeService.updateStudentGrade(data)
			console.log(updateResult)
			if (!updateResult) {
				throw new Error('the grade component is not found')
			} else {
				const finalResult = await this.prismaService.$transaction(
					async (prisma) => {
						const result =
							await this.gradeReviewRepository.setStatusForGradeReview(
								request.gradeReviewId,
								GradeReviewStatus.APPROVED,
								prisma
							)

						const finals = await prisma.gradeReviewFinal.create({
							data: {
								gradeReview: {
									connect: {
										id: request.gradeReviewId
									}
								},
								reviewer: {
									connect: {
										id: request.reviewerId
									}
								},
								finalGrade: request.finalGrade
							}
						})
						return finals
					}
				)
			}
		} catch (error) {
			console.log(error)
			throw new DatabaseExecutionException(error.message)
		}
	}

	async rejectGradeReview(request: RejectGradeReviewRequest) {
		try {
			const result = await this.prismaService.$transaction(async (prisma) => {
				const result = await this.gradeReviewRepository.setStatusForGradeReview(
					request.gradeReviewId,
					GradeReviewStatus.REJECTED,
					prisma
				)
				const final = await prisma.gradeReviewFinal.create({
					data: {
						gradeReview: {
							connect: {
								id: request.gradeReviewId
							}
						},
						reviewer: {
							connect: {
								id: request.reviewerId
							}
						}
					}
				})
				return result
			})

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
}
