import {
	Controller,
	Get,
	HttpCode,
	Req,
	Post,
	Body,
	Res,
	UseInterceptors,
	UploadedFile
} from '@nestjs/common'
import { AdminService } from './admin.service'
import { plainToClass } from 'class-transformer'
import { UserFullInfoReponse } from './resource/dto'
import { Roles } from '@common/decorator/roles.decorator'
import { Role } from '@common/decorator/role.enum'
import { Request, Response } from 'express'
import { Public } from '@common/decorator'
import { FileInterceptor } from '@nestjs/platform-express/multer'

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

	@Public()
	@Get('xlsx-template-mapping-id')
	@HttpCode(200)
	async getXlsxTemplateMappingId(
		@Req() request: Request,
		@Res() response: Response
	) {
		const result = await this.adminService.getXlsxTemplateMappingId()
		response.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		)
		response.setHeader(
			'Content-Disposition',
			'attachment; filename=' + 'admin_mapping.xlsx'
		)
		response.send(result)
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

	@Post('update-user-official-id')
	@HttpCode(200)
	async updateUserOfficialId(
		@Req() request: Request,
		@Body() body: { userId: string; officialId: string }
	) {
		const result = await this.adminService.updateUserOfficialId(body)
		return {
			message: 'update user official id successfully',
			data: result
		}
	}

	@Public()
	@Post('upload-xlsx-mapping-id')
	@UseInterceptors(FileInterceptor('file'))
	async uploadXlsxMappingId(@UploadedFile() file, @Req() request: Request) {
		const result = await this.adminService.uploadXlsxMappingId(file)
		return { message: 'upload xlsx mapping id successfully', data: result }
	}
}
