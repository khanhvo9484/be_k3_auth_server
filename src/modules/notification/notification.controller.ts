import { Body, Controller, Post, Req } from '@nestjs/common'
import { NotificationService } from './notification.service'

@Controller('notification')
export class NotificationController {
	constructor(private notificationService: NotificationService) {}

	@Post('set-is-read')
	async setIsRead(
		@Req() request: Request,
		@Body() body: { userId: string; notificationId: string }
	) {
		const result = await this.notificationService.setIsRead(body)
		return {
			message: 'set is read success',
			data: result
		}
	}
}
