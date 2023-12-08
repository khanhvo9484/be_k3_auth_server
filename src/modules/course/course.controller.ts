import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Req
} from '@nestjs/common'
import { CourseService } from './course.service'
import {
	CreateCourseRequest,
	JoinCourseRequest,
	UpdateCourseRequest
} from './dto/course.dto'

@Controller('courses')
export class CourseController {
	constructor(private courseService: CourseService) {}

	@Get('all')
	async getAllCourse(@Req() request: { userId: string }) {
		return await this.courseService.getAllCourse(request.userId)
	}

	@Get('course/:id')
	async getCourseById(@Param('id') id: string) {
		return await this.courseService.getCourseById(id)
	}

	@Post('create')
	async createCourse(@Body() body: CreateCourseRequest) {
		return await this.courseService.createCourse(body)
	}

	@Put('update-course')
	async updateCourse(@Body() body: UpdateCourseRequest) {
		return await this.courseService.updateCourse(body)
	}
	@Put('update-invite-code')
	async updateInviteCode(@Body() body: { courseId: string }) {
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
