import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Req
} from '@nestjs/common'
import { CourseService } from './course.service'
import {
	CourseResponse,
	CreateCourseRequest,
	JoinCourseRequest,
	UpdateCourseRequest
} from './dto/course.dto'
import { Request, Response } from 'express'
import { plainToClass } from 'class-transformer'

@Controller('courses')
export class CourseController {
	constructor(private courseService: CourseService) {}

	@Get('all')
	@HttpCode(200)
	async getAllCourse(@Req() request: Request) {
		const user = request.user
		const result = await this.courseService.getAllCourse(user.id)
		const refinedResult = result.map((item) => {
			return plainToClass(CourseResponse, item)
		})
		return { message: 'get all course successfully', data: refinedResult }
	}

	@Get('course/:id')
	async getCourseById(@Param('id') id: string) {
		return await this.courseService.getCourseById(id)
	}

	@Post('create')
	@HttpCode(201)
	async createCourse(
		@Req() request: Request,
		@Body() body: CreateCourseRequest
	) {
		const user = request.user
		body.courseOwnerId = user.id
		const result = await this.courseService.createCourse(body)
		return { message: 'create course successfully', data: result }
	}

	@Put('update-course')
	async updateCourse(@Body() body: UpdateCourseRequest) {
		return await this.courseService.updateCourse(body)
	}
	@Put('update-invite-code')
	async updateInviteCode(
		@Req() request: Request,
		@Body() body: { courseId: string }
	) {
		return await this.courseService.updateInviteCode(body.courseId)
	}

	@Put('update-role')
	async updateRole(@Body() body: { courseId: string }) {
		// return await this.courseService.updateRole(body.courseId)
	}

	@Post('join-by-token')
	async joinCourse(@Body() body: { inviteToken: string }) {
		return await this.courseService.joinCourseByToken(body.inviteToken)
	}

	@Post('join-by-invite-code')
	async joinCourseByInviteCode(@Body() joinCourseRequest: JoinCourseRequest) {
		return await this.courseService.joinCourseByInviteCode(joinCourseRequest)
	}

	@Post('send-invitation')
	async sendInvitation(@Body() body: { courseId: string; email: string }) {
		throw new Error('Not implemented')
	}

	@Delete('delete/:id')
	async deleteCourse(@Param('id') id: string) {
		return await this.courseService.deleteCourse(id)
	}

	@Delete('leave/:id')
	async leaveCourse(
		@Param('id') id: string,
		@Req() request: { userId: string }
	) {
		// return await this.courseService.leaveCourse(id, request.userId)
	}
	@Delete('remove/:id')
	async removeUserFromCourse(
		@Param('id') id: string,
		@Req() request: { userId: string }
	) {
		// return await this.courseService.removeUserFromCourse(id, request.userId)
	}
}
