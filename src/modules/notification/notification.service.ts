import { Injectable } from '@nestjs/common'
import { NotificationRepository } from './notification.repository'
import { CreateNotificationDto } from './resource/dto'
import { DatabaseExecutionException } from '@common/exceptions'

@Injectable()
export class NotificationService {
	constructor(private notificationRepository: NotificationRepository) {}

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
			const result =
				await this.notificationRepository.getNotificationByUserId(userId)
			return result
		} catch (error) {
			throw new DatabaseExecutionException(error.message)
		}
	}

	async setIsRead(params: { userId: string; notificationId: string }) {
		try {
			const result = await this.notificationRepository.setIsRead(params)
			return result
		} catch (error) {
			throw new DatabaseExecutionException(error.message)
		}
	}

	async createNotificationForTeacher(params: {
		courseId: string
		notification: CreateNotificationDto
	}) {
		try {
			const { courseId, notification } = params
			const result = await this.notificationRepository.create(notification)
			return result
		} catch (error) {
			throw new DatabaseExecutionException(error.message)
		}
	}

	async createNotificationForStudent(params: {
		courseId: string
		notification: CreateNotificationDto
	}) {
		try {
			const { courseId, notification } = params
			const result = await this.notificationRepository.create(notification)
			return result
		} catch (error) {
			throw new DatabaseExecutionException(error.message)
		}
	}
}
