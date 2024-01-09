import { filter } from 'rxjs/operators'
import { GradeSubComponent } from './../grade-structure/resource/dto/index'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ExcelService } from '@utils/excel/excel.service'
import {
	STUDENT_INFO_COLUMNS,
	STUDENT_MAPPING_ID_COLUMNS
} from './resource/constant'
import { plainToClass } from 'class-transformer'
import {
	AddGradeStudentDto,
	CreateStudentGradeDto,
	CreateStudentMappingIdDto,
	DataFromExcelFile
} from './resource/dto'
import { StudentGradeRepository } from './student-grade.repository'
import { DatabaseExecutionException } from '@common/exceptions'
import { UsersService } from '@user/user.service'
import { CourseService } from 'modules/course/course.service'
import { UserResponse } from '@user/dto/user.dto'
import { GradeStructureService } from '../grade-structure/grade-structure.service'
import { GradeComponentStatus } from '../resource/enum'

@Injectable()
export class StudentGradeService {
	constructor(
		private readonly excelService: ExcelService,
		private studentGradeRepository: StudentGradeRepository,
		private userService: UsersService,
		private courseService: CourseService,
		private gradeStructureService: GradeStructureService
	) {}

	async getStudentGrade(courseId: string, studentId: string): Promise<any> {
		try {
			const result = await this.studentGradeRepository.getStudentGrade(
				courseId,
				studentId
			)

			if (!result) {
				throw new BadRequestException('Student grade not found')
			}
			const gradeStructure =
				await this.gradeStructureService.getGradeStructure(courseId)
			const gradeComponent = gradeStructure.gradeComponent

			const gradedComponentIds = gradeComponent
				.filter((item) => item.status === GradeComponentStatus.IS_GRADED)
				.map((item) => item.id)

			const resultObject = result.toJSON()

			const finalResult = {
				...resultObject,
				grade: {
					...resultObject.grade,
					gradeComponent: resultObject.grade.gradeComponent.filter((item) => {
						return gradedComponentIds.includes(item['id'])
					})
				}
			}

			return finalResult
		} catch (err) {
			console.log(err)
			throw err
		}
	}

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

			if (studentList.length === 0) {
				throw new BadRequestException('Student list not found')
			}

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
								[gradeSubItem.name]: ''
							}
						}
					)

					const gradeSubComponentObject = gradeSubcomponents.reduce(
						(a, b) => Object.assign(a, b),
						{}
					)

					return {
						MSSV: item.studentOfficialId,
						'Họ và tên': item.fullName,
						...gradeSubComponentObject
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
			throw err
		}
	}

	async getStudentGradeBoard(courseId: string) {
		try {
			const result =
				await this.studentGradeRepository.getStudentGradeByCourseId(courseId)

			if (result.length === 0) {
				return []
			}
			const finalResult = result.map((item) => {
				return item.toJSON()
			})
			return finalResult
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	async uploadStudentList(file: any, courseId: string) {
		try {
			const data = await this.excelService.readExcelFile(file)
			const listStudents = data.map((item) => {
				return plainToClass(CreateStudentGradeDto, item)
			})
			const gradeStructure =
				await this.gradeStructureService.getGradeStructure(courseId)
			const gradeComponent = gradeStructure.gradeComponent

			const listStudentsWithCourseId = listStudents.map((item) => {
				return {
					...item,
					courseId,
					finalGrade: null,
					grade: {
						gradeComponent: gradeComponent.map((gradeComponent) => {
							return {
								name: gradeComponent.name,
								_id: gradeComponent.id,
								gradeSubComponent: gradeComponent.gradeSubComponent.map(
									(gradeSubComponent) => {
										return {
											name: gradeSubComponent.name,
											_id: gradeSubComponent['id'],
											grade: null,
											percentage: gradeSubComponent.percentage
										}
									}
								),
								totalGrade: null,
								percentage: gradeComponent.percentage
							}
						})
					}
				}
			})
			const result = await this.studentGradeRepository.createManyStudentGrade(
				listStudentsWithCourseId
			)
			const setUnEditableResult =
				await this.gradeStructureService.setUnEditable(courseId)

			if (!result) {
				throw new DatabaseExecutionException('upload student list failed')
			}
			const finalResult = result.map((item) => {
				return item.toJSON()
			})
			return finalResult
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

	async uploadStudentGrade(
		file: any,
		courseId: string,
		gradeComponentId: string
	) {
		try {
			const data = await this.excelService.readExcelFile(file)

			if (data.length === 0) {
				throw new BadRequestException('File is empty')
			}

			if (data[0]['MSSV'] === undefined || data[0]['MSSV'] === null) {
				throw new BadRequestException('File is not correct 1')
			}

			const gradeStructure =
				await this.gradeStructureService.getGradeComponentById(
					courseId,
					gradeComponentId
				)

			const gradeComponent = gradeStructure.gradeComponent
			if (gradeComponent.length === 0) {
				throw new BadRequestException('Grade component not found')
			}

			const gradeSubComponent = gradeComponent[0].gradeSubComponent

			if (gradeSubComponent.length === 0) {
				if (
					data[0][gradeComponent[0].name] === undefined ||
					data[0][gradeComponent[0].name] === null
				) {
					throw new BadRequestException('File is not correct 2')
				}

				const typedData = data.map((item) => {
					return plainToClass(DataFromExcelFile, item)
				})
				const dataWithCourseId = typedData.map((item) => {
					return { ...item, courseId }
				})
				const gradeComponentName = gradeComponent[0].name

				const dataWithGradeComponent = dataWithCourseId.map((item) => {
					return {
						studentOfficialId: item.studentOfficialId,
						fullName: item.fullName,
						courseId: item.courseId,
						finalGrade: null,

						gradeComponent: gradeComponent.map((gradeComponent) => {
							return {
								name: gradeComponent.name,
								_id: gradeComponent.id,
								gradeSubComponent: [],
								totalGrade: item[gradeComponentName],
								percentage: gradeComponent.percentage
							}
						})
					}
				})

				const typeDataWithFinalGrade = dataWithGradeComponent.map((item) => {
					return plainToClass(AddGradeStudentDto, item)
				})

				const result = await Promise.all(
					typeDataWithFinalGrade.map(async (item) => {
						return await this.studentGradeRepository.updateStudentGradeOnceUploadExcel(
							item
						)
					})
				)

				if (!result) {
					throw new DatabaseExecutionException('Upload grade failed')
				}
				return result
			} else {
				if (
					data[0][gradeComponent[0].gradeSubComponent[0].name] === undefined ||
					data[0][gradeComponent[0].gradeSubComponent[0].name] === null
				) {
					throw new BadRequestException('File is not correct 2')
				}

				const listSubComponent = gradeComponent[0].gradeSubComponent.map(
					(subComponent) => {
						return {
							[subComponent.name]: null
						}
					}
				)
				const gradeSubComponentObject = listSubComponent.reduce(
					(a, b) => Object.assign(a, b),
					{}
				)
				const keysArray = Object.keys(gradeSubComponentObject)

				const typedData = data.map((item) => {
					return plainToClass(DataFromExcelFile, item)
				})
				const dataWithCourseId = typedData.map((item) => {
					return { ...item, courseId }
				})
				const dataWithGradeComponent = dataWithCourseId.map((item) => {
					return {
						studentOfficialId: item.studentOfficialId,
						fullName: item.fullName,
						courseId: item.courseId,
						finalGrade: null,

						gradeComponent: gradeComponent.map((gradeComponent) => {
							return {
								name: gradeComponent.name,
								_id: gradeComponent.id,
								gradeSubComponent: keysArray.map((key) => {
									return {
										name: key,
										_id: gradeSubComponent.find((subComponent) => {
											return subComponent.name === key
										})['id'],
										percentage: gradeSubComponent.find((subComponent) => {
											return subComponent.name === key
										}).percentage,
										grade: item[key]
									}
								}),
								totalGrade: null,
								percentage: gradeComponent.percentage
							}
						})
					}
				})

				const dataWithFinalGrade = dataWithGradeComponent.map((item) => {
					const gradeComponent = item.gradeComponent.map((gradeComponent) => {
						const gradeSubComponent = gradeComponent.gradeSubComponent.map(
							(gradeSubComponent) => {
								return {
									grade: gradeSubComponent.grade,
									percentage: gradeSubComponent.percentage
								}
							}
						)
						const finalGrade = gradeSubComponent.reduce(
							(accumulator, { grade, percentage }) => {
								return accumulator + (grade * percentage) / 100
							},
							0
						)
						return {
							...gradeComponent,
							totalGrade: finalGrade
						}
					})
					return {
						...item,
						gradeStructure: gradeComponent
					}
				})

				const typeDataWithFinalGrade = dataWithFinalGrade.map((item) => {
					return plainToClass(AddGradeStudentDto, item)
				})

				const result = await Promise.all(
					typeDataWithFinalGrade.map(async (item) => {
						return await this.studentGradeRepository.updateStudentGradeOnceUploadExcel(
							item
						)
					})
				)
				if (!result) {
					throw new DatabaseExecutionException('Upload grade failed')
				}
				return result
			}
		} catch (err) {
			console.log(err)
			throw new DatabaseExecutionException(err.message)
		}
	}

	async updateStudentGrade(params: {
		courseId: string
		studentOfficialId: string
		gradeId: string
		grade: number
	}) {
		try {
			const { courseId, studentOfficialId, gradeId, grade } = params
			if (gradeId.startsWith('GC')) {
				const result =
					await this.studentGradeRepository.updateStudentGradeGradeComponent(
						{
							courseId,
							studentOfficialId,
							gradeId
						},
						{
							grade
						}
					)

				if (!result) {
					throw new BadRequestException(
						'Update grade failed, grade component not found'
					)
				}
				return result
			} else {
				const result =
					await this.studentGradeRepository.updateStudentGradeSubGradeComponent(
						{
							courseId,
							studentOfficialId,
							gradeId
						},
						{
							grade
						}
					)

				if (!result) {
					throw new BadRequestException(
						'Update grade failed, grade sub component not found'
					)
				}
				return result
			}
		} catch (err) {
			console.log(err)
			throw new DatabaseExecutionException(err.message)
		}
	}
}
