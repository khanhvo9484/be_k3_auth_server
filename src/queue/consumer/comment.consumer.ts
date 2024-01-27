import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
@Processor('BROADCAST_COMMENT')
export class BroadcastCommentConsumer {
	@Process('BROADCAST_COMMENT_JOB')
	async broadcastComment(job: Job<any>) {
		const { data } = job
		try {
			console.log('BROADCAST_COMMENT_JOB', data)
		} catch (error) {
			console.log(error)
			throw new Error(error.message)
		}
	}
}
