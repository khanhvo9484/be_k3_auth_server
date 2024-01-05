import { StudentGradeService } from './student-grade.service'
import { Body, Controller, UploadedFile } from '@nestjs/common'
import { Get, Post, Put, Req, Res, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express/multer'
import { Request, Response } from 'express'
import { ExcelService } from '@utils/excel/excel.service'

@Controller('student-grade')
export class StudentGradeController {
	constructor(
		private excelService: ExcelService,
		private studentGradeService: StudentGradeService
	) {}
	@Get('student-xlsx-template')
	async getStudentXlsxTemplate(
		@Req() request: Request,
		@Res() response: Response
	) {
		const { buffer, fileName } =
			await this.studentGradeService.getStudentXlsxTemplate()

		response.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		)
		response.setHeader(
			'Content-Disposition',
			'attachment; filename=' + fileName
		)
		response.send(buffer)
	}

	@Get('student-mapping-id-xlsx-template')
	async getStudentMappingIdXlsxTemplate(
		@Req() request: Request,
		@Res() response: Response
	) {
		const { buffer, fileName } =
			await this.studentGradeService.getStudentMappingIdXlsxTemplate()

		response.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		)
		response.setHeader(
			'Content-Disposition',
			'attachment; filename=' + fileName
		)
		response.send(buffer)
	}

	@Get('student-grade-xlsx-template')
	async getStudentGradeXlsxTemplate(
		@Req() request: Request,
		@Res() response: Response
	) {
		return response.status(200).send({
			message: 'get student grade xlsx template success'
		})
	}

	@UseInterceptors(FileInterceptor('file'))
	@Post('upload-student-list')
	async uploadStudentList(
		@UploadedFile() file,
		@Req() request: Request,
		@Body() body: { courseId: string }
	) {
		const courseId = body.courseId
		const result = await this.studentGradeService.uploadStudentList(
			file,
			courseId
		)
		return {
			message: 'upload student list success',
			data: result
		}
	}

	@UseInterceptors(FileInterceptor('file'))
	@Post('upload-student-mapping-id')
	async uploadStudentMappingId(
		@UploadedFile() file,
		@Req() request: Request,
		@Body() body: { courseId: string }
	) {
		const courseId = body.courseId
		const user = request.user
		const result = await this.studentGradeService.uploadStudentMappingId(
			file,
			courseId,
			user
		)
		return {
			message: 'upload student list success',
			data: result
		}
	}

	@Post('upload-student-grade')
	async uploadStudentGrade(@Req() request: Request, @Res() response: Response) {
		return response.status(200).send({
			message: 'upload student grade success'
		})
	}
}
