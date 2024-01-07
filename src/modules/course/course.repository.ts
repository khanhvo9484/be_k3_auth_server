import { Injectable } from '@nestjs/common'
import { Prisma, Course, User_Course, Invitation } from '@prisma/client'
import { PrismaService } from '@my-prisma/prisma.service'
import { CreateCourseRequest } from './dto/course.dto'
@Injectable()
export class CourseRepository {
	constructor(private prisma: PrismaService) {}

	async getCourseById(params: Prisma.CourseWhereUniqueInput): Promise<Course> {
		const result = await this.prisma.course.findUnique({
			where: { isDeleted: false, ...params }
		})
		return result
	}

	async getCourseByMemberId(params: Prisma.User_CourseWhereUniqueInput) {
		const result = await this.prisma.user_Course.findUnique({
			where: params,
			select: {
				course: true,
				roleInCourse: true
			}
		})
		const course = { ...result.course, roleInCourse: result.roleInCourse }
		return course
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

	async getAllCourseByAdmin() {
		const result = await this.prisma.course.findMany({
			include: {
				courseOwner: true
			}
		})
		return result
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
		const result = await this.prisma.course.findMany({
			where: {
				courseOwnerId: userId,
				isDeleted: true
			},
			include: {
				courseOwner: true
			}
		})
		return result.map((item) => item)
	}

	async getAllCourseMember(where: Prisma.User_CourseWhereInput) {
		const result = await this.prisma.user_Course.findMany({
			where,
			include: {
				user: true
			}
		})

		const students = result
			.filter((item) => item.roleInCourse === 'student')
			.map((item) => item.user)
		const teachers = result
			.filter((item) => item.roleInCourse === 'teacher')
			.map((item) => item.user)

		return { students, teachers }
	}
	async getInvitation(params: Prisma.InvitationWhereUniqueInput) {
		const result = await this.prisma.invitation.findUnique({
			where: params
		})
		return result
	}
	async getAllInvitation(where: Prisma.InvitationWhereInput) {
		const result = await this.prisma.invitation.findMany({
			where
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

	async leaveCourse(
		where: Prisma.User_CourseWhereUniqueInput
	): Promise<User_Course> {
		const result = await this.prisma.user_Course.delete({
			where
		})
		return result
	}

	async deleteCourse(where: Prisma.CourseWhereUniqueInput) {
		const result = await this.prisma.course.update({
			where: where,
			data: { isDeleted: true }
		})
		return result
	}

	async realDeleteCourse(where: Prisma.CourseWhereUniqueInput) {
		const result = await this.prisma.course.delete({
			where: where
		})
		return result
	}

	async deleteAllEnrollmentInCourse(where: Prisma.User_CourseWhereInput) {
		const result = await this.prisma.user_Course.deleteMany({
			where
		})
		return result
	}

	async getMemberInCourseByRole(courseId: string, role: string) {
		const result = await this.prisma.user_Course.findMany({
			where: {
				courseId: courseId,
				roleInCourse: role
			},
			select: {
				user: true
			}
		})
		return result.map((item) => item.user)
	}
}
