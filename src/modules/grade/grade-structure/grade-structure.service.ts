import { NotificationService } from './../../../notification/notification.service'
import {
	BadRequestException,
	Inject,
	Injectable,
	forwardRef
} from '@nestjs/common'
import { Model } from 'mongoose'
import { IGradeStructure } from '../resource/shemas'
import { GradeStructureRepository } from './grade-structure.repository'
import {
	CreateGradeStructureRequest,
	CreateGradeSubcomponent,
	GradeStructureResponse,
	MarkGradeFinalRequest,
	UpdateGradeStructureRequest,
	UpdateGradeStructureRequestRewrite,
	UpdateGradeSubComponentRequest
} from './resource/dto'
import { DatabaseExecutionException } from '@common/exceptions'
import { PrismaService } from '@my-prisma/prisma.service'

import { generateId } from '@utils/id-helper'
import { plainToClass } from 'class-transformer'
import { CreateNotificationDto } from 'notification/resource/dto'
import { NotificationType } from 'notification/resource/enum'
import { CourseService } from 'modules/course/course.service'
@Injectable()
export class GradeStructureService {
	constructor(
		@Inject('GRADE_STRUCTURE_MODEL')
		private gradeStructureModel: Model<IGradeStructure>,
		private gradeRepository: GradeStructureRepository,
		private prismaService: PrismaService,
		private notificationService: NotificationService

		// @Inject(forwardRef(() => CourseService))
		// private courseService: CourseService
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

			return result
		} catch (error) {
			console.log(error)
			if (error instanceof BadRequestException) {
				throw error
			}
			throw new DatabaseExecutionException(error.message)
		}
	}

	async updateGradeStructure(request: UpdateGradeStructureRequest[]) {
		try {
			const gradeStructureList = request.map((item) => {
				return plainToClass(UpdateGradeStructureRequest, item)
			})
			const result = await Promise.all(
				gradeStructureList.map(async (item) => {
					return await this.gradeRepository.updateGradeStructure(item)
				})
			)

			if (!result) {
				throw new BadRequestException('Grade structure not found')
			}
			if (Array.isArray(result)) {
				if (result[0] !== null) return result[0]
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
			if (!result) {
				throw new BadRequestException('Grade structure not found')
			}
			return result
		} catch (error) {
			throw new DatabaseExecutionException(error.message)
		}
	}

	async getGradeComponentById(courseId: string, componentId: string) {
		try {
			const result = await this.gradeRepository.getGradeComponentById(
				courseId,
				componentId
			)
			if (!result) {
				throw new BadRequestException('Grade component not found')
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
				if (result[0] !== null) return result[0]
				throw new BadRequestException('Grade structure not found')
			}
			return result
		} catch (error) {
			console.log(error)
			throw new DatabaseExecutionException(error.message)
		}
	}

	async updateGradeRewrite(
		request: UpdateGradeStructureRequestRewrite[],
		courseId
	) {
		try {
			const result = await this.gradeRepository.updateGradeStructureRewrite(
				request,
				courseId
			)

			if (!result) {
				throw new BadRequestException('Grade structure not found')
			}
			return result
		} catch (error) {
			console.log(error)
			throw new DatabaseExecutionException(error.message)
		}
	}

	async updateGradeSubComponent(request: UpdateGradeSubComponentRequest[]) {
		try {
			const subcomponentList = request.map((item) => {
				return plainToClass(UpdateGradeSubComponentRequest, item)
			})
			const result = await Promise.all(
				subcomponentList.map(async (item) => {
					return await this.gradeRepository.updateGradeSubComponent(item)
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

	async markGradeFinal(request: MarkGradeFinalRequest, user: CustomJwtPayload) {
		try {
			const result = await this.gradeRepository.markGradeFinal(
				request.courseId,
				request.gradeComponentId
			)
			// const course = await this.courseService.getCourseById({
			// 	userId: user.id,
			// 	courseId: request.courseId
			// })
			// if (!result) {
			// 	throw new BadRequestException('Grade structure not found')
			// }
			// const createNotificationDto = new CreateNotificationDto({
			// 	type: NotificationType.NEW_GRADE_REVIEW,
			// 	content: ` đã đăng tải điểm thành phần ${result.toJSON()} của khóa học ${
			// 		course.name
			// 	}`,
			// 	title: 'New grade review request',
			// 	targetId: result.id,
			// 	actorId: user.id
			// })
			// const notificationResult =
			// 	await this.notificationService.createNotificationForStudent({
			// 		courseId: request.courseId,
			// 		notification: createNotificationDto
			// 	})
			// console.log(notificationResult)

			return result.toJSON()
		} catch (error) {
			console.log(error)
			throw new DatabaseExecutionException(error.message)
		}
	}
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
