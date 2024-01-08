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

	async createMany(data: Prisma.NotificationCreateManyInput[], tx?: any) {
		if (tx)
			return await tx.notification.createMany({
				data
			})
		const result = await this.prismaService.notification.createMany({
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
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
		return result
	}

	async updateNotification(params: {
		where: Prisma.NotificationWhereInput
		data: Prisma.NotificationUpdateInput
	}) {
		const { where, data } = params
		const result = await this.prismaService.notification.updateMany({
			where,
			data
		})
		return result
	}
}
