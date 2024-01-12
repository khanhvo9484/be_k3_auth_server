import { MyGatewayService } from './../socket/gateway'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { NotificationRepository } from './notification.repository'
import { CreateNotificationDto } from './resource/dto'
import { DatabaseExecutionException } from '@common/exceptions'
import { CourseService } from 'modules/course/course.service'
import { generateId } from '@utils/id-helper'
@Injectable()
export class NotificationService {
	constructor(
		private notificationRepository: NotificationRepository,

		@Inject(forwardRef(() => CourseService))
		private courseService: CourseService,

		@Inject(forwardRef(() => MyGatewayService))
		private myGatewayService: MyGatewayService
	) {}

	async create(notification: CreateNotificationDto, tx?: any) {
		try {
			const result = await this.notificationRepository.create(notification, tx)
			this.myGatewayService.broadcastNotification(
				[{ userId: result.userId }],
				result
			)
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

	async setIsRead(params: { userId: string }) {
		try {
			const result = await this.notificationRepository.updateNotification({
				where: {
					userId: params.userId
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
		tx?: any
	}) {
		try {
			const { courseId, notification, role } = params
			const memberList = await this.courseService.getMemberInCourseByRole(
				courseId,
				role
			)

			const data = memberList.map((member) => {
				return {
					...notification,
					id: generateId('NT'),
					userId: member.id
				}
			})

			let returnData = null
			if (params.tx) {
				returnData = await this.notificationRepository.createMany(
					data,
					params.tx
				)
			} else {
				returnData = await this.notificationRepository.createMany(data)
			}

			const listUserIds = memberList.map((member) => {
				return { userId: member.id }
			})

			this.myGatewayService.broadcastNotification(listUserIds, notification)

			return returnData
		} catch (error) {
			throw new DatabaseExecutionException(error.message)
		}
	}

	//Template method
	async createNotificationForTeacher(params: {
		courseId: string
		notification: CreateNotificationDto
		tx?: any
	}) {
		if (params.tx)
			return this.createNotificationForRole({
				...params,
				role: 'teacher',
				tx: params.tx
			})
		else
			return this.createNotificationForRole({
				...params,
				role: 'teacher'
			})
	}

	async createNotificationForStudent(params: {
		courseId: string
		notification: CreateNotificationDto
		tx?: any
	}) {
		if (params.tx)
			return this.createNotificationForRole({
				...params,
				role: 'student',
				tx: params.tx
			})
		else
			return this.createNotificationForRole({
				...params,
				role: 'student'
			})
	}

	async createNotificationForInvolvers(params: {
		involvers: string[]
		notification: CreateNotificationDto
		tx?: any
	}): Promise<any> {
		try {
			const { involvers, notification, tx } = params

			const data = involvers.map((involverId) => {
				return {
					...notification,
					userId: involverId
				}
			})
			let returnData = null
			if (tx) {
				returnData = await this.notificationRepository.createMany(data, tx)
			} else {
				returnData = await this.notificationRepository.createMany(data)
			}

			const listUserIds = involvers.map((memberId) => {
				return { userId: memberId }
			})

			this.myGatewayService.broadcastNotification(listUserIds, notification)

			return returnData
		} catch (error) {
			throw new DatabaseExecutionException(error.message)
		}
	}
}
