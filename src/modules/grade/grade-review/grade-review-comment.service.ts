import { Injectable } from '@nestjs/common'
import { PrismaService } from '@my-prisma/prisma.service'
import { CreateCommentOnGradeReviewRequest } from './resource/dto'
import { NotificationService } from 'notification/notification.service'
import { CourseUtilService } from 'modules/course-util/course-util.service'
import { GradeReviewRepository } from './grade-review.repository'
import { CreateNotificationDto } from 'notification/resource/dto'
import { NotificationType } from 'notification/resource/enum'
import { DatabaseExecutionException } from '@common/exceptions'
@Injectable()
export class GradeReviewCommentService {
	constructor(
		private prismaService: PrismaService,
		private notificationService: NotificationService,
		private courseUtilService: CourseUtilService,
		private gradeReviewRepository: GradeReviewRepository
	) {}
	async commentOnGradeReview(request: CreateCommentOnGradeReviewRequest) {
		try {
			const userId = request.userId
			const requestWithoutId = {
				...request,
				userId: undefined,
				gradeReviewId: undefined
			}

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

			if (request.ownerId !== userId) {
				const createNotificationDto = new CreateNotificationDto({
					type: NotificationType.NEW_GRADE_REVIEW_COMMENT,
					content: `đã bình luận về đơn phúc khảo của bạn`,
					title: 'Bình luận mới',
					targetId: result.id,
					actorId: userId
				})

				const isInvolve =
					await this.gradeReviewRepository.getIfUserInvolveInGradeReview(
						request.gradeReviewId,
						userId
					)
				if (!isInvolve) {
					await this.gradeReviewRepository.createGradeReviewInvolve({
						gradeReview: {
							connect: {
								id: request.gradeReviewId
							}
						},
						user: {
							connect: {
								id: userId
							}
						}
					})
				}

				const notification = await this.notificationService.create(
					createNotificationDto
				)
			} else {
				const createNotificationDto = new CreateNotificationDto({
					type: NotificationType.NEW_GRADE_REVIEW_COMMENT,
					content: `đã bình luận về đơn phúc khảo của anh/cô ấy`,
					title: 'Bình luận mới',
					targetId: result.id,
					actorId: userId
				})

				const involvers =
					await this.gradeReviewRepository.getAllGradeReviewInvolve(
						request.gradeReviewId
					)
				const involverIds = involvers.map((involver) => involver.userId)

				const notification =
					await this.notificationService.createNotificationForInvolvers({
						involvers: involverIds,
						notification: createNotificationDto
					})
			}

			return result
		} catch (error) {
			console.log(error)
			throw new DatabaseExecutionException(error.message)
		}
	}

	async getGradeReviewInvolve(gradeReviewId: string) {
		try {
		} catch (error) {
			console.log(error)
			throw new DatabaseExecutionException(error.message)
		}
	}
}
