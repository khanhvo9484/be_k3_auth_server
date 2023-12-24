import { Injectable, Inject } from '@nestjs/common'
import { Model } from 'mongoose'
import { INotification } from './resource/schema'
import { CreateNotificationDto } from './resource/dto'

@Injectable()
export class NotificationRepository {
	constructor(
		@Inject('NOTIFICATION_MODEL')
		private notificationModel: Model<INotification>
	) {}

	async create(notification: CreateNotificationDto) {
		const result = await this.notificationModel.create(notification)
		return result.toJSON()
	}

	async getNotificationByUserId(userId: string) {
		const result = await this.notificationModel.find({ userId })
		if (result.length === 0) {
			return null // No matching documents found
		} else {
			// Assuming result is an array, you may need to iterate over it
			const notifications = result.map((doc) => doc.toJSON())
			return notifications
		}
	}

	async setIsRead(params: { userId: string; notificationId: string }) {
		const { userId, notificationId } = params
		const result = await this.notificationModel.findOneAndUpdate(
			{ 'actions._id': notificationId, userId },
			{
				$set: {
					'actions.$.isRead': true
				}
			},
			{ new: true }
		)
		return result.toJSON()
	}
}
