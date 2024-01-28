import { NOTIFICATION_SERVICE_URL } from '@enviroment/index'
import { HttpService } from '@nestjs/axios'
import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { firstValueFrom } from 'rxjs'
@Processor('SEND_NOTIFICATION')
export class SendNotificationConsumer {
	constructor(private httpService: HttpService) {}
	@Process('SEND_NOTIFICATION_JOB')
	async sendNotification(job: Job<any>) {
		const { data } = job
		try {
			await firstValueFrom(
				this.httpService.post(
					`${NOTIFICATION_SERVICE_URL}/notification/broadcast-notification`,
					data
				)
			)
		} catch (error) {
			console.log(error)
			throw new Error(error.message)
		}
	}
}
