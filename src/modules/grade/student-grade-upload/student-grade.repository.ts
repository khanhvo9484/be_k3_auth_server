import { Inject, Injectable } from '@nestjs/common'
import { IGradeStructure, IStudentGrade } from '../resource/shemas'
import { Model } from 'mongoose'
import { AddGradeStudentDto, CreateStudentGradeDto } from './resource/dto'
@Injectable()
export class StudentGradeRepository {
	constructor(
		@Inject('STUDENT_GRADE_MODEL')
		private studentGradeModel: Model<IStudentGrade>
	) {}

	async createManyStudentGrade(entity: CreateStudentGradeDto[]) {
		const result = await this.studentGradeModel.insertMany(entity)
		return result
	}
	async getStudentGradeByCourseId(courseId: string) {
		const result = await this.studentGradeModel.find({ courseId })
		return result
	}

	async updateStudentGrade(entity: Object, where: Object) {
		const result = await this.studentGradeModel.updateOne(where, entity)
		return result
	}

	async updateStudentGradeOnceUploadExcel(request: AddGradeStudentDto) {
		const result = await this.studentGradeModel.findOneAndUpdate(
			{
				courseId: request.courseId,
				studentOfficialId: request.studentOfficialId
			},
			{
				$push: {
					'grade.gradeStructure': request.gradeStructure[0]
					// grade: { gradeStructure: request.gradeStructure }
				}
			},
			{
				new: true
			}
		)
		return result.toJSON()
	}
}
