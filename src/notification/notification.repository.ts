import { Injectable, Inject } from '@nestjs/common'
import { CreateNotificationDto } from './resource/dto'
import { PrismaService } from '@my-prisma/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class NotificationRepository {
	constructor(private prismaService: PrismaService) {}

	async create(data: Prisma.NotificationCreateInput) {
		const result = await this.prismaService.notification.create({
			data
		})
		return result
	}

	async getNotificationByUserId(where: Prisma.NotificationWhereInput) {
		const result = await this.prismaService.notification.findMany({
			where,
			include: {
				actor: true,
				user: true
			}
		})
		return result
	}

	async updateNotification(params: {
		where: Prisma.NotificationWhereUniqueInput
		data: Prisma.NotificationUpdateInput
	}) {
		const { where, data } = params
		const result = await this.prismaService.notification.update({
			where,
			data
		})
		return result
	}
}
