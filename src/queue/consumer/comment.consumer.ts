import { NOTIFICATION_SERVICE_URL } from '@enviroment/index'
import { HttpService } from '@nestjs/axios'
import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { firstValueFrom } from 'rxjs'
@Processor('BROADCAST_COMMENT')
export class BroadcastCommentConsumer {
	constructor(private httpService: HttpService) {}
	@Process('BROADCAST_COMMENT_JOB')
	async broadcastComment(job: Job<any>) {
		const { data } = job
		try {
			console.log(data)
			try {
				await firstValueFrom(
					this.httpService.post(
						`${NOTIFICATION_SERVICE_URL}/comment/broadcast-comment`,
						data
					)
				)
			} catch (error) {
				console.log(error)
				throw new Error(error.message)
			}
		} catch (error) {
			console.log(error)
			throw new Error(error.message)
		}
	}
}
