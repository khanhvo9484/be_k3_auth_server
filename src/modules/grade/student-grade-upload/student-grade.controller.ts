import { StudentGradeService } from './student-grade.service'
import { Body, Controller, Param, Query, UploadedFile } from '@nestjs/common'
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

	@Get('student-grade/:courseId/:studentId')
	async getStudentGrade(
		@Req() request: Request,
		@Param() param: { courseId: string; studentId: string }
	) {
		const result = await this.studentGradeService.getStudentGrade(
			param.courseId,
			param.studentId
		)
		return {
			message: 'get student grade success',
			data: result
		}
	}

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

	@Get('student-mapping-id-xlsx-template/:courseId')
	async getStudentMappingIdXlsxTemplate(
		@Req() request: Request,
		@Res() response: Response,
		@Param('courseId') courseId: string
	) {
		const { buffer, fileName } =
			await this.studentGradeService.getStudentMappingIdXlsxTemplate(courseId)

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

	@Get('student-grade-xlsx-template/:courseId')
	async getStudentGradeXlsxTemplate(
		@Req() request: Request,
		@Param('courseId') courseId: string,
		@Query('grade-component-id') gradeComponentId: string,
		@Res() response: Response
	) {
		const { buffer, fileName } =
			await this.studentGradeService.getStudentGradeXlsxTemplate(
				courseId,
				gradeComponentId
			)

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

	@Get('student-grade-board/:courseId')
	async getStudentGradeBoard(
		@Req() request: Request,
		@Param() param: { courseId: string }
	) {
		const result = await this.studentGradeService.getStudentGradeBoard(
			param.courseId
		)
		return {
			message: 'get student grade board success',
			data: result
		}
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

	@UseInterceptors(FileInterceptor('file'))
	@Post('upload-student-grade')
	async uploadStudentGrade(
		@UploadedFile() file,
		@Req() request: Request,
		@Body()
		body: {
			courseId: string
			gradeComponentId: string
		}
	) {
		const result = await this.studentGradeService.uploadStudentGrade(
			file,
			body.courseId,
			body.gradeComponentId
		)
		return {
			message: 'upload student grade success',
			data: result
		}
	}

	@Put('update-student-grade')
	async updateStudentGrade(
		@Req() request: Request,
		@Body()
		body: {
			studentOfficialId: string
			courseId: string
			gradeId: string
			grade: number
		}
	) {
		const result = await this.studentGradeService.updateStudentGrade(body)
		return {
			message: 'update student grade success',
			data: result
		}
	}
}
