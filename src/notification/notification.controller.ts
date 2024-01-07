import { Body, Controller, Post, Req, Get, Param } from '@nestjs/common'
import { NotificationService } from './notification.service'

@Controller('notification')
export class NotificationController {
	constructor(private notificationService: NotificationService) {}

	@Get('get-notification/:userId')
	async getNotification(
		@Req() request: Request,
		@Param('userId') userId: string
	) {
		const result =
			await this.notificationService.getNotificationByUserId(userId)
		return {
			message: 'get notification success',
			data: result
		}
	}

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

	@Post('create-notification')
	async createNotification(@Body() body: any) {
		const result =
			await this.notificationService.createNotificationForTeacher(body)
		return {
			message: 'create notification success',
			data: result
		}
	}
}
