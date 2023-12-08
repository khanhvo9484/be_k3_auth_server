import { Prisma, Course } from '@prisma/client'
export interface ICourseService {
	getAllCourse(
		userId: string,
		params: {
			skip?: number
			take?: number
			cursor?: Prisma.UserWhereUniqueInput
			where?: Prisma.UserWhereInput
			orderBy?: Prisma.UserOrderByWithRelationInput
		}
	): Promise<Course[]>
	getCourseById(id: string): Promise<Course>
	createCourse(data: Prisma.CourseCreateInput): Promise<Course>
	updateCourse(id: string, data: Prisma.CourseUpdateInput): Promise<Course>
	deleteCourse(id: string): Promise<Course>
}
