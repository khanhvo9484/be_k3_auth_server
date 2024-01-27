import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

@Injectable()
export class NotificationQueueService {
	constructor(
		@InjectQueue('SEND_NOTIFICATION') private sendNotificationQueue: Queue
	) {}

	async sendNotification(payload: any) {
		try {
			const result = await this.sendNotificationQueue.add(
				'SEND_NOTIFICATION_JOB',
				payload
			)
			return result
		} catch (error) {
			console.log(error)
			throw new Error(error.message)
		}
	}
}
