import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { IGradeStructure } from '../resource/shemas'
import { GradeStructureRepository } from './grade-structure.repository'
import {
	CreateGradeStructureRequest,
	CreateGradeSubcomponent,
	GradeStructureResponse,
	UpdateGradeStructureRequest
} from './resource/dto'
import { DatabaseExecutionException } from '@common/exceptions'
import { PrismaService } from '@my-prisma/prisma.service'
import { NotificationService } from 'modules/notification/notification.service'
import { CreateNotificationDto } from 'modules/notification/resource/dto'
import { NotificationType } from 'modules/notification/resource/enum'

import { generateId } from '@utils/id-helper'
import { plainToClass } from 'class-transformer'
@Injectable()
export class GradeStructureService {
	constructor(
		@Inject('GRADE_STRUCTURE_MODEL')
		private gradeStructureModel: Model<IGradeStructure>,
		private gradeRepository: GradeStructureRepository,
		private prismaService: PrismaService,
		private notificationService: NotificationService
	) {}

	async createGradeStructure(
		request: CreateGradeStructureRequest,
		user: CustomJwtPayload
	) {
		try {
			const isCourseOwner = await this.isCourseOwner(request.courseId, user.id)
			if (!isCourseOwner) {
				throw new BadRequestException(
					'You do not have permission to create grade structure'
				)
			}
			const course = await this.gradeRepository.getGradeStructureByCourseId(
				request.courseId
			)
			if (course) {
				throw new BadRequestException('Grade structure already exists')
			}

			const result = await this.gradeRepository.createGradeStructure({
				...request,
				_id: generateId('GS')
			})

			const notification: CreateNotificationDto = {
				userId: user.id,
				actions: [
					{
						actorId: user.id,
						type: NotificationType.NEW_GRADE_STRUCTURE,
						targetId: request.courseId,
						content: `New grade structure for course ${request.courseId}`,
						isRead: false
					}
				]
			}

			this.notificationService.create(notification)
			return result
		} catch (error) {
			console.log(error)
			if (error instanceof BadRequestException) {
				throw error
			}
			throw new DatabaseExecutionException(error.message)
		}
	}

	async updateGradeStructure(request: UpdateGradeStructureRequest) {
		try {
			const result = await this.gradeRepository.updateGradeStructure(request)
			if (!result) {
				throw new BadRequestException('Grade structure not found')
			}
			return result
		} catch (error) {
			throw new DatabaseExecutionException(error.message)
		}
	}

	async getGradeStructure(courseId: string) {
		try {
			const result =
				await this.gradeRepository.getGradeStructureByCourseId(courseId)
			console.log(result)
			if (!result) {
				throw new BadRequestException('Grade structure not found')
			}
			return result
		} catch (error) {
			throw new DatabaseExecutionException(error.message)
		}
	}

	async createGradeSubcomponent(request: CreateGradeSubcomponent[]) {
		try {
			const subcomponentList = request.map((item) => {
				return plainToClass(CreateGradeSubcomponent, item)
			})
			const result = await Promise.all(
				subcomponentList.map(async (item) => {
					return await this.gradeRepository.createGradeSubcomponent(item)
				})
			)
			if (!result) {
				throw new BadRequestException('Grade structure not found')
			}
			if (Array.isArray(result)) {
				return result[0]
			}
			return result
		} catch (error) {
			console.log(error)
			throw new DatabaseExecutionException(error.message)
		}
	}

	// async updateGradeSubComponent(request: UpdateGradeSubComponentRequest[]) {
	// 	try {
	// 		const subcomponentList = request.map((item) => {
	// 			return plainToClass(UpdateGradeSubComponentRequest, item)
	// 		})
	// 		const result = await Promise.all(
	// 			subcomponentList.map(async (item) => {
	// 				return await this.gradeRepository.updateGradeSubComponent(item)
	// 			})
	// 		)
	// 		if (!result) {
	// 			throw new BadRequestException('Grade structure not found')
	// 		}
	// 		if (Array.isArray(result)) {
	// 			return result[0]
	// 		}
	// 		return result
	// 	} catch (error) {
	// 		console.log(error)
	// 		throw new DatabaseExecutionException(error.message)
	// 	}
	// }
	async isCourseOwner(courseId: string, userId: string) {
		try {
			const result = await this.prismaService.user_Course.findFirst({
				where: {
					courseId,
					userId,
					roleInCourse: 'teacher'
				}
			})
			return true
		} catch (error) {
			return false
		}
	}
}
