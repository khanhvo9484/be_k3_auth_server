import { User } from '@prisma/client'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	Req
} from '@nestjs/common'
import { CourseService } from './course.service'
import {
	CourseResponse,
	CreateCourseRequest,
	CreateInvitationRequest,
	JoinCourseRequest,
	UpdateCourseRequest
} from './dto/course.dto'
import { Request, Response } from 'express'
import { plainToClass } from 'class-transformer'
import { UserResponse } from '@user/dto/user.dto'

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

	@Get('get-all-course-member')
	@HttpCode(200)
	async getAllCourseMember(
		@Req() request: Request,
		@Query('courseId') courseId: string
	) {
		const user = request.user
		console.log()
		const result = await this.courseService.getAllCourseMember(user, courseId)
		const refinedResult = result.map((item) => {
			return plainToClass(UserResponse, item)
		})
		return { message: 'get all course member successfully', data: result }
	}

	@Get('course/:id')
	async getCourseById(@Param('id') id: string) {
		const result = await this.courseService.getCourseById(id)

		return { message: '', data: plainToClass(CourseResponse, result) }
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
	@HttpCode(200)
	async updateCourse(@Body() body: UpdateCourseRequest) {
		const result = await this.courseService.updateCourse(body)
		return { message: 'update course successfully', data: result }
	}

	// This API is used to update invite code of a course
	@Put('update-invite-code')
	@HttpCode(200)
	async updateInviteCode(
		@Req() request: Request,
		@Body() body: { courseId: string }
	) {
		const result = await this.courseService.updateInviteCode(body.courseId)
		return { message: 'update invite code successfully', data: result }
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
	@HttpCode(201)
	async sendInvitation(
		@Req() request: Request,
		@Body() body: CreateInvitationRequest
	) {
		const user = request.user
		body.inviterId = user.id

		const result = await this.courseService.sendInvitation(body)
		return { message: 'send invitation successfully', data: result }
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
