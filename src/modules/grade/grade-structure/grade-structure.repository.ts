import { Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { IGradeStructure } from '../resource/shemas'
import {
	CreateGradeStructureRequest,
	UpdateGradeStructureRequest
} from '../resource/dto/grade-structure'

@Injectable()
export class GradeStructureRepository {
	constructor(
		@Inject('GRADE_STRUCTURE_MODEL')
		private gradeStructureModel: Model<IGradeStructure>
	) {}

	async createGradeStructure(entity: Object) {
		const result = await this.gradeStructureModel.create(entity)
		return result.toJSON()
	}
	async getGradeStructureByCourseId(courseId: string) {
		const result = await this.gradeStructureModel.findOne({ courseId })
		if (!result) {
			return null
		}
		return result.toJSON()
	}

	async updateGradeStructure(request: UpdateGradeStructureRequest) {
		const { id } = request
		const result = await this.gradeStructureModel.findByIdAndUpdate(
			{ _id: id },
			{ gradeComponent: request.gradeComponent }
		)
		return result
	}
}
