import { IsNotEmpty, IsOptional } from 'class-validator'
import { Exclude, Expose } from 'class-transformer'
import { INotification } from '../schema'
import { NotificationType } from '../enum'
import { Notification } from '@prisma/client'
import { generateId } from '@utils/id-helper'

@Exclude()
export class CreateNotificationDto implements Notification {
	@Expose()
	@IsOptional()
	id: string = generateId('NT')

	@Expose()
	@IsOptional()
	actorId: string

	@Expose()
	@IsOptional()
	title: string

	@Expose()
	@IsNotEmpty()
	content: string

	@Expose()
	@IsNotEmpty()
	type: string

	@Expose()
	@IsNotEmpty()
	targetId: string

	@Expose()
	@IsOptional()
	user: null

	@Expose()
	@IsOptional()
	actor: null

	@Expose()
	createdAt: Date
	@Expose()
	updatedAt: Date
	@Expose()
	deletedAt: Date

	@Expose()
	@IsNotEmpty()
	userId: string

	@Expose()
	@IsOptional()
	isRead: boolean = false
}
// export class ActionDto {
// 	@IsNotEmpty()
// 	actorId: string

// 	@IsNotEmpty()
// 	type: NotificationType

// 	@IsNotEmpty()
// 	content: string

// 	@IsNotEmpty()
// 	targetId: string

// 	@IsOptional()
// 	isRead: boolean = false
// }
