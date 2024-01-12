import {
	EmailTempateId,
	InviteToCourseSubstitution
} from './../../shared/email-template'
import { UsersService } from './../user/user.service'
import { TokenFactoryService } from './../../utils/jwt-helper/token-factory.service'
import { generateCode } from '@utils/id-helper'
import {
	BadRequestException,
	Inject,
	Injectable,
	forwardRef
} from '@nestjs/common'
import { ICourseService } from './course.interface'
import { Prisma, Course, User_Course } from '@prisma/client'
import { CourseRepository } from './course.repository'
import { DatabaseExecutionException } from '@common/exceptions'
import {
	CreateCourseRequest,
	CreateInvitationRequest,
	JoinCourseRequest,
	UpdateCourseRequest,
	InviteToCoursePayload
} from './dto/course.dto'
import { InviteToCourseEmailSenderPayload } from '@utils/email-sender/resources/email.interface'
import { TokenType } from '@utils/jwt-helper/resources/token-type.enum'
import { InviteToCourseToken } from '@utils/jwt-helper/resources/invite-to-course-token'
import { PrismaService } from '@my-prisma/prisma.service'
import { EmailSenderService } from '@utils/email-sender/email-sender.service'
import {
	FE_INVITE_TO_COURSE_URL,
	FE_VERIFICATION_URL,
	PROTOCOL
} from '@enviroment/index'
import { plainToClass } from 'class-transformer'
import { UserResponse } from '@user/dto/user.dto'
import { GradeStructureService } from '../grade/grade-structure/grade-structure.service'
import { CreateGradeStructureRequest } from 'modules/grade/resource/dto'
import { InviteToCourseJwtPayload } from '@utils/jwt-helper/resources/token.interface'

@Injectable()
export class CourseService {
	constructor(
		private courseRepository: CourseRepository,
		private tokenFactoryService: TokenFactoryService,
		private usersService: UsersService,
		private prisma: PrismaService,
		private emailSenderService: EmailSenderService,

		private gradeStructureService: GradeStructureService
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
	async getAllCourseByAdmin() {
		try {
			return await this.courseRepository.getAllCourseByAdmin()
		} catch (error) {
			throw new DatabaseExecutionException('Get all course failed')
		}
	}

	async getAllArchivedCourse(
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
			return await this.courseRepository.getAllArchivedCourse(userId, params)
		} catch (error) {
			throw new DatabaseExecutionException('Get all archived course failed')
		}
	}

	async getAllCourseMember(user: CustomJwtPayload, courseId: string) {
		try {
			const userInCourse = await this.courseRepository.getEnrollmentById({
				userId_courseId: {
					userId: user.id,
					courseId: courseId
				}
			})
			if (!userInCourse) {
				throw new BadRequestException('You are not in this course')
			}
			const result = await this.prisma.$transaction(
				async (prisma) => {
					const memberListResult =
						await this.courseRepository.getAllCourseMember({
							courseId: courseId
						})
					const students = memberListResult.students.map((item) => {
						return {
							...plainToClass(UserResponse, item),
							roleInCourse: 'student'
						}
					})
					const teachers = memberListResult.teachers.map((item) => {
						return {
							...plainToClass(UserResponse, item),
							roleInCourse: 'teacher'
						}
					})
					const memberList = { teachers, students }
					const invitationList = await this.courseRepository.getAllInvitation({
						courseId: courseId,
						status: 'pending'
					})
					// const invitationList = invitationListResult.map((item) => {
					// 	return {
					// 		...item,
					// 		roleInCourse: item.roleInCourse
					// 	}
					// })
					const mergedList = { memberList, invitationList }
					return mergedList
				},
				{
					maxWait: 30000, // default: 2000
					timeout: 30000 // default: 5000
				}
			)

			return result
		} catch (error) {
			console.error(error)
			throw new DatabaseExecutionException('Get all course member failed')
		}
	}

	async getAllCourseStudentIds(courseId: string) {
		try {
			const result = await this.prisma.$transaction(
				async (prisma) => {
					const memberListResult =
						await this.courseRepository.getAllCourseMember({
							courseId: courseId
						})
					const students = memberListResult.students.map((item) => {
						return { id: item.id, email: item.email }
					})
					return students
				},
				{
					maxWait: 30000, // default: 2000
					timeout: 30000 // default: 5000
				}
			)

			return result
		} catch (error) {
			console.error(error)
			throw new DatabaseExecutionException('Get all course member failed')
		}
	}
	async getCourseById(params: {
		userId: string
		courseId: string
	}): Promise<Course> {
		try {
			const { userId, courseId } = params
			const result = await this.courseRepository.getCourseByMemberId({
				userId_courseId: {
					userId: userId,
					courseId: courseId
				}
			})
			return result
		} catch (error) {
			throw new DatabaseExecutionException('Get course by id failed')
		}
	}
	async createCourse(
		createCourseRequest: CreateCourseRequest,
		user: CustomJwtPayload
	): Promise<Course> {
		try {
			const result = await this.prisma.$transaction(
				async (prisma) => {
					const createdCourse = await this.courseRepository.createCourse({
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

					const createdEnrollment = await this.courseRepository.joinCourse({
						roleInCourse: 'teacher',
						course: {
							connect: {
								id: createdCourse.id
							}
						},
						user: {
							connect: {
								id: createCourseRequest.courseOwnerId
							}
						}
					})

					const createGradeStructureRequest = plainToClass(
						CreateGradeStructureRequest,
						{
							courseId: createdCourse.id,
							gradeComponent: []
						}
					)

					const createdGradeStructure =
						await this.gradeStructureService.createGradeStructure(
							createGradeStructureRequest,
							user
						)
					return createdCourse
				},
				{
					maxWait: 30000, // default: 2000
					timeout: 30000 // default: 5000
				}
			)

			return result
		} catch (error) {
			console.log(error)
			throw new DatabaseExecutionException('Create course failed')
		}
	}

	async sendInvitation(createInvitationRequest: CreateInvitationRequest) {
		try {
			const tokenPayload = createInvitationRequest
			const token = this.tokenFactoryService.sign(
				tokenPayload as InviteToCourseJwtPayload,
				TokenType.INVITE_TO_COURSE
			)
			const inviterUser = await this.prisma.user.findUnique({
				where: { id: createInvitationRequest.inviterId }
			})
			const course = await this.prisma.course.findUnique({
				where: { id: createInvitationRequest.courseId }
			})

			if (!inviterUser || !course) {
				throw new BadRequestException('User or course not found')
			}

			const substitutionData: InviteToCourseSubstitution = {
				invitation_link: FE_INVITE_TO_COURSE_URL + '?token=' + token,
				protocol: PROTOCOL,
				inviter_email: inviterUser?.email || 'no email',
				inviter_name: inviterUser?.name || 'no name',
				course_name: course?.name || 'no name',
				role_in_course:
					createInvitationRequest.roleInCourse === 'teacher'
						? 'giáo viên'
						: 'học sinh'
			}
			const result = await this.courseRepository.createInvitation({
				id: createInvitationRequest.id,
				inviteeEmail: createInvitationRequest.inviteeEmail,
				inviter: {
					connect: {
						id: createInvitationRequest.inviterId
					}
				},
				status: 'pending',
				course: {
					connect: {
						id: createInvitationRequest.courseId
					}
				},
				roleInCourse: createInvitationRequest.roleInCourse
			})
			const sendEmailResult =
				await this.emailSenderService.sendWithTemplate<InviteToCourseEmailSenderPayload>(
					{
						to: createInvitationRequest.inviteeEmail,
						templateId: EmailTempateId.INVITE_TO_COURSE,
						substitutionData: substitutionData
					}
				)

			return result
		} catch (error) {
			console.error(error)
			throw new DatabaseExecutionException(error.message)
		}
	}

	async joinCourseByToken(inviteToken: string) {
		let tempPayload = await this.tokenFactoryService.verify(
			inviteToken,
			TokenType.INVITE_TO_COURSE
		)
		if (!tempPayload) {
			throw new BadRequestException('Invalid token')
		}
		const payload = plainToClass(InviteToCoursePayload, tempPayload)

		if (payload instanceof InviteToCoursePayload) {
			try {
				const invitee = await this.usersService.findUser({
					email: payload.inviteeEmail
				})
				if (!invitee) {
					throw new BadRequestException(
						'Invalid token, invitee not found, maybe user has not registered yet'
					)
				}
				const invitaion = await this.courseRepository.getInvitation({
					id: payload.id
				})

				if (!invitaion) {
					throw new BadRequestException('Invalid token, invitation not found')
				}
				const transactionResult = await this.prisma.$transaction(
					async (prisma) => {
						const enrollment = await this.courseRepository.getAllEnrollment({
							userId: invitee.id,
							courseId: payload.courseId
						})
						console.log(enrollment)
						if (enrollment.length > 0) {
							if (enrollment[0].roleInCourse === payload.roleInCourse) {
								throw new BadRequestException(
									'Invitee already joined this course with this role'
								)
							} else {
								const updatedEnrollemt =
									await this.courseRepository.updateEnrollment({
										where: {
											userId_courseId: {
												userId: enrollment[0].userId,
												courseId: payload.courseId
											}
										},
										data: {
											roleInCourse: payload.roleInCourse,
											invitation: {
												connect: {
													id: payload.id
												}
											}
										}
									})
								return updatedEnrollemt
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
						const updateInvitationResult =
							await this.courseRepository.updateInvitation({
								where: {
									id: payload.id
								},
								data: {
									status: 'accepted'
								}
							})
						return result
					},
					{
						maxWait: 30000, // default: 2000
						timeout: 30000 // default: 5000
					}
				)

				return transactionResult
			} catch (error) {
				throw new DatabaseExecutionException(
					error.message || 'Join course failed'
				)
			}
		}
		throw new BadRequestException('Invalid token')
	}

	async joinCourseByInviteCode(
		joinCourseRequest: JoinCourseRequest
	): Promise<User_Course> {
		try {
			const course = await this.courseRepository.getCourseById({
				inviteCode: joinCourseRequest.inviteCode
			})
			if (!course) {
				throw new BadRequestException('Course is not found')
			}
			const enrollment = await this.courseRepository.getAllEnrollment({
				userId: joinCourseRequest.userId,
				courseId: course.id
			})

			if (enrollment.length > 0) {
				throw new BadRequestException('You already joined this course')
			}

			const result = await this.courseRepository.joinCourse({
				course: {
					connect: {
						id: course.id
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
			// console.log(error)
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
	async deleteCourse(id: string) {
		try {
			const result = await this.prisma.$transaction(
				async (prisma) => {
					const updateCourseToDeleted =
						await this.courseRepository.deleteCourse({
							id: id
						})
					const deletedEnrollment =
						await this.courseRepository.deleteAllEnrollmentInCourse({
							courseId: id
						})
					return updateCourseToDeleted
				},
				{
					maxWait: 30000, // default: 2000
					timeout: 30000 // default: 5000
				}
			)
			return result
		} catch (error) {
			throw new DatabaseExecutionException('Delete course failed')
		}
	}

	async realDeleteCourse(id: string) {
		try {
			const result = await this.prisma.$transaction(
				async (prisma) => {
					const deletedCourse = await this.courseRepository.realDeleteCourse({
						id: id
					})
					return deletedCourse
				},
				{
					maxWait: 30000, // default: 2000
					timeout: 30000 // default: 5000
				}
			)
			return result
		} catch (error) {
			throw new DatabaseExecutionException('Real delete course failed')
		}
	}

	async leaveCourse(leaveCourseRquest: { userId: string; courseId: string }) {
		try {
			const { userId, courseId } = leaveCourseRquest
			const result = await this.courseRepository.leaveCourse({
				userId_courseId: { userId: userId, courseId: courseId }
			})
			return result
		} catch (error) {
			throw new DatabaseExecutionException('Leave course failed', 'EEEEEE')
		}
	}

	async removeUserFromCourse(params: {
		ownerId: string
		userId: string
		courseId: string
	}) {
		try {
			const { ownerId, userId, courseId } = params
			const course = await this.courseRepository.getCourseById({
				id: courseId
			})
			if (!course) {
				throw new BadRequestException('Course not found')
			}
			if (course.courseOwnerId !== ownerId) {
				throw new BadRequestException('You are not the owner of this course')
			}
			const result = await this.courseRepository.leaveCourse({
				userId_courseId: {
					userId: userId,
					courseId: courseId
				}
			})
			return result
		} catch (error) {
			throw new DatabaseExecutionException('Remove user from course failed')
		}
	}

	async getMemberInCourseByRole(courseId: string, role: string) {
		try {
			const result = await this.courseRepository.getMemberInCourseByRole(
				courseId,
				role
			)
			return result
		} catch (error) {
			throw new DatabaseExecutionException('Get teacher list failed')
		}
	}
}
