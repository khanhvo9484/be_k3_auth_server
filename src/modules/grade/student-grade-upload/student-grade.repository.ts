import { Inject, Injectable } from '@nestjs/common'
import { IGradeStructure, IStudentGrade } from '../resource/shemas'
import { Model } from 'mongoose'
import { CreateStudentGradeDto } from './resource/dto'
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
}
