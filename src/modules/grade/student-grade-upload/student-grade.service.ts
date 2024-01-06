import { BadRequestException, Injectable } from '@nestjs/common'
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
import { UserResponse } from '@user/dto/user.dto'
import { GradeStructureService } from '../grade-structure/grade-structure.service'
@Injectable()
export class StudentGradeService {
	constructor(
		private readonly excelService: ExcelService,
		private studentGradeRepository: StudentGradeRepository,
		private userService: UsersService,
		private courseService: CourseService,
		private gradeStructureService: GradeStructureService
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

	async getStudentMappingIdXlsxTemplate(courseId: string) {
		try {
			const studentList =
				await this.studentGradeRepository.getStudentGradeByCourseId(courseId)
			const studentListInExcel = studentList.map((item) => {
				return {
					MSSV: item.studentOfficialId,
					'Họ và tên': item.fullName,
					Email: ''
				}
			})

			const sheetName = 'student account'
			const fileName = 'studentsMappingAccount.xlsx'
			const buffer = await this.excelService.generateExcelBufferWithData(
				studentListInExcel,
				sheetName
			)

			return { buffer, fileName }
		} catch (err) {
			console.log(err)
		}
	}

	async getStudentGradeXlsxTemplate(
		courseId: string,
		gradeComponentId: string
	) {
		try {
			const sheetName = 'student account'
			const fileName = 'studentgrades.xlsx'
			const studentList =
				await this.studentGradeRepository.getStudentGradeByCourseId(courseId)

			const gradeStructure =
				await this.gradeStructureService.getGradeComponentById(
					courseId,
					gradeComponentId
				)
			if (gradeStructure.gradeComponent.length === 0) {
				throw new BadRequestException('Grade component not found')
			}
			const gradeComponent = gradeStructure.gradeComponent

			if (gradeComponent[0].gradeSubComponent.length === 0) {
				const data = studentList.map((item) => {
					return {
						MSSV: item.studentOfficialId,
						'Họ và tên': item.fullName,
						[gradeComponent[0].name]: ''
					}
				})
				const buffer = await this.excelService.generateExcelBufferWithData(
					data,
					sheetName
				)
				return { buffer, fileName }
			} else {
				const data = studentList.map((item) => {
					const gradeSubcomponents = gradeComponent[0].gradeSubComponent.map(
						(gradeSubItem) => {
							return {
								[gradeComponent[0].gradeSubComponent[0].name]: ''
							}
						}
					)

					const data3 = gradeSubcomponents.reduce(
						(a, b) => Object.assign(a, b),
						{}
					)
					return {
						MSSV: item.studentOfficialId,
						'Họ và tên': item.fullName,
						...data3
					}
				})
				const buffer = await this.excelService.generateExcelBufferWithData(
					data,
					sheetName
				)
				return { buffer, fileName }
			}
		} catch (err) {
			console.log(err)
		}
	}

	async uploadStudentList(file: any, courseId: string) {
		try {
			const data = await this.excelService.readExcelFile(file)
			const listStudents = data.map((item) => {
				return plainToClass(CreateStudentGradeDto, item)
			})
			const listStudentsWithCourseId = listStudents.map((item) => {
				return { ...item, courseId, grade: null }
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
		const findInList = (
			list: CreateStudentMappingIdDto[],
			email: string
		): CreateStudentMappingIdDto => {
			return list.find((item: any) => {
				return item.email === email
			})
		}
		try {
			const data = await this.excelService.readExcelFile(file)
			const studentsListFromFile = data.map((item) => {
				return plainToClass(CreateStudentMappingIdDto, item)
			})

			if (data.length === 0) {
				throw new BadRequestException('File is empty')
			}

			const studentListInCourse =
				await this.courseService.getAllCourseStudentIds(courseId)

			const studentListInCourseWithOfficialId = studentListInCourse.map(
				(item) => {
					const student = findInList(studentsListFromFile, item.email)
					if (student) {
						return {
							...item,
							officialId: student.studentOfficialId
						}
					}
				}
			)

			const updateResult = await Promise.all(
				studentListInCourseWithOfficialId.map(async (item) => {
					return await this.userService.updateUserOfficialId({
						where: {
							id: item.id,
							studentOfficialId: null || ''
						},
						data: {
							studentOfficialId: item.officialId.toString()
						}
					})
				})
			)
			return plainToClass(UserResponse, updateResult)
		} catch (err) {
			console.log(err)
			throw new DatabaseExecutionException(err.message)
		}
	}

	async uploadStudentGrade(file: any, courseId: string) {
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
}
