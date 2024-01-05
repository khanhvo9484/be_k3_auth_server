import { Injectable } from '@nestjs/common'
import { ExcelService } from '@utils/excel/excel.service'
import {
	STUDENT_INFO_COLUMNS,
	STUDENT_MAPPING_ID_COLUMNS
} from './resource/constant'
import { plainToClass } from 'class-transformer'
import {
	CreateStudentGradeDto,
	CreateStudentMappingIdDto
} from './resource/dto'
import { StudentGradeRepository } from './student-grade.repository'
import { DatabaseExecutionException } from '@common/exceptions'
import { UsersService } from '@user/user.service'
import { CourseService } from 'modules/course/course.service'
@Injectable()
export class StudentGradeService {
	constructor(
		private readonly excelService: ExcelService,
		private studentGradeRepository: StudentGradeRepository,
		private userService: UsersService,
		private courseService: CourseService
	) {}

	async generateExcelFileWithColumns(
		fileName: string,
		sheetName: string,
		columns: any[]
	) {
		const buffer = await this.excelService.generateExcelBuffer(
			columns,
			sheetName
		)
		return buffer
	}

	async getStudentXlsxTemplate() {
		const columns = STUDENT_INFO_COLUMNS
		const sheetName = 'students'
		const fileName = 'studentsInfo.xlsx'
		const buffer = await this.generateExcelFileWithColumns(
			fileName,
			sheetName,
			columns
		)
		return { buffer, fileName }
	}

	async getStudentMappingIdXlsxTemplate() {
		const columns = STUDENT_MAPPING_ID_COLUMNS
		const sheetName = 'student account'
		const fileName = 'studentsMappingAccount.xlsx'
		const buffer = await this.generateExcelFileWithColumns(
			fileName,
			sheetName,
			columns
		)
		return { buffer, fileName }
	}

	async uploadStudentList(file: any, courseId: string) {
		try {
			const data = await this.excelService.readExcelFile(file)
			const listStudents = data.map((item) => {
				return plainToClass(CreateStudentGradeDto, item)
			})
			const listStudentsWithCourseId = listStudents.map((item) => {
				return { ...item, courseId }
			})
			const result = await this.studentGradeRepository.createManyStudentGrade(
				listStudentsWithCourseId
			)

			if (!result) {
				throw new DatabaseExecutionException('upload student list failed')
			}
			const finalResult = result.map((item) => {
				return item.toJSON()
			})
			return result
		} catch (err) {
			throw new DatabaseExecutionException(err.message)
		}
	}

	async uploadStudentMappingId(
		file: any,
		courseId: string,
		user: CustomJwtPayload
	) {
		try {
			const data = await this.excelService.readExcelFile(file)
			const listStudents = data.map((item) => {
				return plainToClass(CreateStudentMappingIdDto, item)
			})
			const listStudentsWithCourseId = listStudents.map((item) => {
				return { ...item, courseId }
			})
			const result = await this.courseService.getAllCourseStudentIds(courseId)
			console.log(result)
			// console.log(listStudentsWithCourseId)
		} catch (err) {
			throw new DatabaseExecutionException(err.message)
		}
	}
}
