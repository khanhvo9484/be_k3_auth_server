import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

@Injectable()
export class CommentQueueService {
	constructor(
		@InjectQueue('BROADCAST_COMMENT') private sendNotificationQueue: Queue
	) {}

	async broadcastComment(payload: { postId: string; data: any }) {
		try {
			const result = await this.sendNotificationQueue.add(
				'BROADCAST_COMMENT_JOB',
				payload
			)
			return result
		} catch (error) {
			console.log(error)
			throw new Error(error.message)
		}
	}
}
