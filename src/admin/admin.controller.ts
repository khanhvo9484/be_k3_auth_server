import { Controller, Get, HttpCode, Req, Post } from '@nestjs/common'
import { AdminService } from './admin.service'
import { plainToClass } from 'class-transformer'
import { UserFullInfoReponse } from './resource/dto'

@Controller('admin')
export class AdminController {
	constructor(private adminService: AdminService) {}

	@Get('users/all')
	@HttpCode(200)
	async getAllUsers(@Req() request: Request) {
		const result = await this.adminService.getAllUsers()
		const refinedResult = result.map((item) => {
			return plainToClass(UserFullInfoReponse, item)
		})
		return { message: 'get all users successfully', data: refinedResult }
	}

	@Get('courses/all')
	@HttpCode(200)
	async getAllCourses(@Req() request: Request) {
		const result = await this.adminService.getAllCourses()
		return { message: 'get all courses successfully', data: result }
	}

	@Get('xlsx-template-mapping-id')
	@HttpCode(200)
	async getXlsxTemplateMappingId(@Req() request: Request) {
		const result = await this.adminService.getXlsxTemplateMappingId()
		return {
			message: 'get xlsx template mapping id successfully',
			data: result
		}
	}

	@Post('block-user')
	@HttpCode(200)
	async banUser(@Req() request: { userId: string }) {
		const result = await this.adminService.banUser(request.userId)
		return { message: 'ban user successfully', data: result }
	}
}
