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

	async getStudentGrade(courseId: string, studentOfficialId: string) {
		const result = await this.studentGradeModel.findOne({
			courseId,
			studentOfficialId
		})
		return result
	}

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
		console.log(request.gradeComponent._id)
		const result = await this.studentGradeModel.findOneAndUpdate(
			{
				courseId: request.courseId,
				studentOfficialId: request.studentOfficialId,
				'grade.gradeComponent._id': request.gradeComponent[0]._id
			},
			{
				$set: {
					'grade.gradeComponent.$': request.gradeComponent[0]
					// grade: { gradeStructure: request.gradeStructure }
				}
			},
			{
				new: true
			}
		)
		return result
	}
}
