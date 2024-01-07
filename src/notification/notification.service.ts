import { Injectable } from '@nestjs/common'
import { NotificationRepository } from './notification.repository'
import { CreateNotificationDto } from './resource/dto'
import { DatabaseExecutionException } from '@common/exceptions'
import { CourseService } from 'modules/course/course.service'
@Injectable()
export class NotificationService {
	constructor(
		private notificationRepository: NotificationRepository,
		private courseService: CourseService
	) {}

	async create(notification: CreateNotificationDto) {
		try {
			const result = await this.notificationRepository.create(notification)
			return result
		} catch (error) {
			throw new DatabaseExecutionException(error.message)
		}
	}

	async getNotificationByUserId(userId: string) {
		try {
			const result = await this.notificationRepository.getNotificationByUserId({
				userId: userId
			})
			return result
		} catch (error) {
			throw new DatabaseExecutionException(error.message)
		}
	}

	async setIsRead(params: { userId: string; notificationId: string }) {
		try {
			const result = await this.notificationRepository.updateNotification({
				where: {
					id: params.notificationId
				},
				data: {
					isRead: true
				}
			})
			return result
		} catch (error) {
			throw new DatabaseExecutionException(error.message)
		}
	}

	async createNotificationForRole(params: {
		courseId: string
		notification: CreateNotificationDto
		role: string
	}) {
		try {
			const { courseId, notification, role } = params
			const memberList = await this.courseService.getMemberInCourseByRole(
				courseId,
				role
			)

			const actorId = notification.actorId
			const notificationForCreate = {
				...notification,
				userId: undefined,
				actorId: undefined
			}

			const createNotificationResult = await Promise.all(
				memberList.map(async (member) => {
					const result = await this.notificationRepository.create({
						...notificationForCreate,
						user: {
							connect: {
								id: member.id
							}
						},
						actor: {
							connect: {
								id: actorId
							}
						}
					})
					return result
				})
			)
			return createNotificationResult
		} catch (error) {
			throw new DatabaseExecutionException(error.message)
		}
	}

	//Template method
	async createNotificationForTeacher(params: {
		courseId: string
		notification: CreateNotificationDto
	}) {
		return this.createNotificationForRole({
			...params,
			role: 'teacher'
		})
	}

	async createNotificationForStudent(params: {
		courseId: string
		notification: CreateNotificationDto
	}) {
		return this.createNotificationForRole({
			...params,
			role: 'student'
		})
	}
}
