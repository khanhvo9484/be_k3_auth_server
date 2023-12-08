import { UsersService } from './../user/user.service'
import { TokenFactoryService } from './../../utils/jwt-helper/token-factory.service'
import { generateCode } from '@utils/id-helper'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ICourseService } from './course.interface'
import { Prisma, Course, User_Course } from '@prisma/client'
import { CourseRepository } from './course.repository'
import { DatabaseExecutionException } from '@common/exceptions'
import {
	CreateCourseRequest,
	JoinCourseRequest,
	UpdateCourseRequest
} from './dto/course.dto'
import { TokenType } from '@utils/jwt-helper/resources/token-type.enum'
import { InviteToCourseToken } from '@utils/jwt-helper/resources/invite-to-course-token'

@Injectable()
export class CourseService {
	constructor(
		private courseRepository: CourseRepository,
		private tokenFactoryService: TokenFactoryService,
		private usersService: UsersService
	) {}

	async getAllCourse(
		userId: string,
		params?: {
			skip?: number
			take?: number
			cursor?: Prisma.UserWhereUniqueInput
			where?: Prisma.UserWhereInput
			orderBy?: Prisma.UserOrderByWithRelationInput
		}
	) {
		try {
			return await this.courseRepository.getAllCourse(userId, params)
		} catch (error) {
			throw new DatabaseExecutionException('Get all course failed')
		}
	}

	async getCourseById(courseId: string): Promise<Course> {
		try {
			const result = await this.courseRepository.getCourseById({ id: courseId })
			return result
		} catch (error) {
			throw new DatabaseExecutionException('Get course by id failed')
		}
	}
	async createCourse(
		createCourseRequest: CreateCourseRequest
	): Promise<Course> {
		try {
			const result = await this.courseRepository.createCourse({
				id: createCourseRequest.id,
				name: createCourseRequest.name,
				description: createCourseRequest.description,
				inviteCode: createCourseRequest.inviteCode,
				courseOwner: {
					connect: {
						id: createCourseRequest.courseOwnerId
					}
				}
			})
			return result
		} catch (error) {
			throw new DatabaseExecutionException('Create course failed')
		}
	}

	async sendInvitation(): Promise<void> {
		throw new Error('Method not implemented.')
	}

	async joinCourseByToken(inviteToken: string): Promise<User_Course> {
		const payload = this.tokenFactoryService.verify(
			inviteToken,
			TokenType.INVITE_TO_COURSE
		)
		if (!payload) {
			throw new BadRequestException('Invalid token')
		}
		if (payload instanceof InviteToCoursePayload) {
			try {
				const invitee = await this.usersService.findUser({
					email: payload.inviteeEmail
				})
				if (!invitee) {
					throw new BadRequestException('Invalid token, invitee not found')
				}
				const invitaion = await this.courseRepository.getInvitation({
					id: payload.id
				})

				if (!invitaion) {
					throw new BadRequestException('Invalid token, invitation not found')
				}

				const enrollment = await this.courseRepository.getAllEnrollment({
					userId: invitee.id,
					courseId: payload.courseId
				})
				if (enrollment.length > 0) {
					if (enrollment[0].roleInCourse === payload.roleInCourse) {
						throw new BadRequestException('Invitee already joined this course')
					} else {
						await this.courseRepository.updateEnrollment({
							where: {
								userId_courseId: {
									userId: enrollment[0].userId,
									courseId: payload.courseId
								}
							},
							data: { roleInCourse: payload.roleInCourse }
						})
					}
				}

				const result = await this.courseRepository.joinCourse({
					roleInCourse: payload.roleInCourse,
					course: {
						connect: {
							id: payload.courseId
						}
					},
					user: {
						connect: {
							id: invitee.id
						}
					},
					invitation: {
						connect: {
							id: payload.id
						}
					}
				})
				return result
			} catch (error) {
				throw new DatabaseExecutionException('Join course failed')
			}
		}
		throw new BadRequestException('Invalid token')
	}

	async joinCourseByInviteCode(
		joinCourseRequest: JoinCourseRequest
	): Promise<User_Course> {
		try {
			const course = await this.courseRepository.getCourseById({
				id: joinCourseRequest.courseId
			})
			if (!course) {
				throw new BadRequestException('Course is not found')
			}
			if (course.inviteCode !== joinCourseRequest.inviteCode) {
				throw new BadRequestException('Invalid invite code')
			}
			const enrollment = await this.courseRepository.getAllEnrollment({
				userId: joinCourseRequest.userId,
				courseId: joinCourseRequest.courseId
			})

			if (enrollment.length > 0) {
				throw new BadRequestException('You already joined this course')
			}

			const result = await this.courseRepository.joinCourse({
				roleInCourse: joinCourseRequest.roleInCourse,
				course: {
					connect: {
						id: joinCourseRequest.courseId
					}
				},
				user: {
					connect: {
						id: joinCourseRequest.userId
					}
				}
			})
			return result
		} catch (error) {
			throw new DatabaseExecutionException('Join course failed')
		}
	}

	async updateCourse(
		updateCourseRequest: UpdateCourseRequest
	): Promise<Course> {
		try {
			const result = await this.courseRepository.updateCourse({
				where: { id: updateCourseRequest.id },
				data: updateCourseRequest
			})
			return result
		} catch (error) {
			throw new DatabaseExecutionException('Update course failed')
		}
	}

	async updateInviteCode(courseId: string): Promise<Course> {
		try {
			const result = await this.courseRepository.updateCourse({
				where: { id: courseId },
				data: {
					inviteCode: generateCode(6)
				}
			})
			return result
		} catch (error) {
			throw new DatabaseExecutionException('Update invite code failed')
		}
	}
	async deleteCourse(id: string): Promise<Course> {
		throw new Error('Method not implemented.')
	}
}
