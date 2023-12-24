import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { INotification } from '../schema'
import { NotificationType } from '../enum'

export class CreateNotificationDto {
	@IsNotEmpty()
	userId: string

	@IsNotEmpty()
	actions: ActionDto[]
}
export class ActionDto {
	@IsNotEmpty()
	actorId: string

	@IsNotEmpty()
	type: NotificationType

	@IsNotEmpty()
	content: string

	@IsNotEmpty()
	targetId: string

	@IsOptional()
	isRead: boolean = false
}
