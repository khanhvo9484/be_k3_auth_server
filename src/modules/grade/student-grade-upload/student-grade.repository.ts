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

	async updateStudentGrade(
		params: { courseId: string; studentOfficialId: string; gradeId: string },
		gradeObject: { grade: number }
	) {
		const { courseId, studentOfficialId, gradeId } = params
		const { grade } = gradeObject

		const result = await this.studentGradeModel.findOneAndUpdate(
			{
				courseId: courseId,
				studentOfficialId: studentOfficialId,
				$or: [
					{ 'grade.gradeComponent._id': gradeId },
					{ 'grade.gradeComponent.gradeSubComponent._id': gradeId }
				]
			},
			{
				$set: {
					'grade.gradeComponent.$[compElem].grade': grade, // Update totalGrade if the first condition matches
					'grade.gradeComponent.$[compElem].gradeSubComponent.$[subCompElem].grade':
						grade // Update grade if the second condition matches
				}
			},
			{
				arrayFilters: [
					{ 'compElem._id': gradeId },
					{ 'subCompElem._id': gradeId }
				],
				new: true
			}
		)
		console.log(result)
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
