import { Injectable } from '@nestjs/common'
import { Prisma, Course, User_Course, Invitation } from '@prisma/client'
import { PrismaService } from '@my-prisma/prisma.service'
import { CreateCourseRequest } from './dto/course.dto'
@Injectable()
export class CourseRepository {
	constructor(private prisma: PrismaService) {}

	async getCourseById(params: Prisma.CourseWhereUniqueInput): Promise<Course> {
		const result = await this.prisma.course.findUnique({
			where: params
		})
		return result
	}

	async getAllEnrollment(
		where: Prisma.User_CourseWhereInput,
		params?: {
			skip?: number
			take?: number
			cursor?: Prisma.UserWhereUniqueInput
			where?: Prisma.UserWhereInput
			orderBy?: Prisma.UserOrderByWithRelationInput
		}
	) {
		const result = await this.prisma.user_Course.findMany({
			where
		})
		return result
	}

	async getEnrollmentById(params: Prisma.User_CourseWhereUniqueInput) {
		const result = await this.prisma.user_Course.findUnique({
			where: params
		})
		return result
	}

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
		const result = await this.prisma.user_Course.findMany({
			where: {
				userId: userId
			},
			select: {
				course: {
					include: {
						courseOwner: true
					}
				}
			}
		})
		return result.map((item) => item.course)
	}
	async getAllCourseMember(where: Prisma.User_CourseWhereInput) {
		const result = await this.prisma.user_Course.findMany({
			where,
			select: {
				user: true
			}
		})
		return result
	}
	async getInvitation(params: Prisma.InvitationWhereUniqueInput) {
		const result = await this.prisma.invitation.findUnique({
			where: params
		})
		return result
	}

	async createCourse(data: Prisma.CourseCreateInput): Promise<Course> {
		const result = await this.prisma.course.create({
			data
		})
		return result
	}

	async joinCourse(data: Prisma.User_CourseCreateInput): Promise<User_Course> {
		const result = await this.prisma.user_Course.create({
			data
		})
		return result
	}

	async createInvitation(
		data: Prisma.InvitationCreateInput
	): Promise<Invitation> {
		const result = await this.prisma.invitation.create({
			data
		})
		return result
	}

	async updateCourse(params: {
		where: Prisma.CourseWhereUniqueInput
		data: Prisma.CourseUpdateInput
	}): Promise<Course> {
		const { data, where } = params
		const result = await this.prisma.course.update({
			data,
			where
		})
		return result
	}

	async updateEnrollment(params: {
		where: Prisma.User_CourseWhereUniqueInput
		data: Prisma.User_CourseUpdateInput
	}): Promise<User_Course> {
		const { data, where } = params
		const result = await this.prisma.user_Course.update({
			data,
			where
		})
		return result
	}
	async updateInvitation(params: {
		where: Prisma.InvitationWhereUniqueInput
		data: Prisma.InvitationUpdateInput
	}): Promise<Invitation> {
		const { data, where } = params
		const result = await this.prisma.invitation.update({
			data,
			where
		})
		return result
	}
}
