import { Controller, Get, HttpCode, Req } from '@nestjs/common'
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
}
