import { Controller, Get, HttpCode, Req, Post, Body } from '@nestjs/common'
import { AdminService } from './admin.service'
import { plainToClass } from 'class-transformer'
import { UserFullInfoReponse } from './resource/dto'
import { Roles } from '@common/decorator/roles.decorator'
import { Role } from '@common/decorator/role.enum'
import { Request, Response } from 'express'
@Controller('admin')
export class AdminController {
	constructor(private adminService: AdminService) {}

	@Roles(Role.Admin)
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
	async banUser(@Req() request: Request, @Body() body: { userId: string }) {
		const result = await this.adminService.banUser(body.userId)
		return { message: 'ban user successfully', data: result }
	}

	@Post('unblock-user')
	@HttpCode(200)
	async unblockUser(@Req() request: Request, @Body() body: { userId: string }) {
		const result = await this.adminService.unBlockUser(body.userId)
		return { message: 'unblock user successfully', data: result }
	}
}
