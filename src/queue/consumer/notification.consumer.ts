import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
@Processor('SEND_NOTIFICATION')
export class SendNotificationConsumer {
	@Process('SEND_NOTIFICATION_JOB')
	async sendNotification(job: Job<any>) {
		const { data } = job
		try {
			console.log('SEND_NOTIFICATION_JOB', data)
		} catch (error) {
			console.log(error)
			throw new Error(error.message)
		}
	}
}
