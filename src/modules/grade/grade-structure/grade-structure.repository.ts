import { Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { IGradeStructure } from '../resource/shemas'
import {
	CreateGradeStructureRequest,
	CreateGradeSubcomponent,
	UpdateGradeStructureRequest
} from './resource/dto'

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
		console.log(courseId)
		const result = await this.gradeStructureModel.findOne({
			courseId: courseId
		})

		if (!result) {
			return null
		}

		return result.toJSON()
	}

	async updateGradeStructure(request: UpdateGradeStructureRequest) {
		const { id } = request
		const result = await this.gradeStructureModel.updateOne(
			{ _id: id },
			{ gradeComponent: request.gradeComponent }
		)
		return result
	}

	async createGradeSubcomponent(request: CreateGradeSubcomponent) {
		const result = await this.gradeStructureModel.updateOne(
			{
				_id: request.gradeStructureId,
				'gradeComponent._id': request.gradeComponentId
			},
			{ $push: { 'gradeComponent.$.gradeSubComponent': request } }
		)
		if (result.acknowledged === true) {
			const updatedDocument = await this.gradeStructureModel.findOne(
				{
					_id: request.gradeStructureId,
					'gradeComponent._id': request.gradeComponentId
				},
				{ 'gradeComponent.$': 1 } // Use $ projection to return only the matched gradeComponent
			)

			if (updatedDocument) {
				return updatedDocument.gradeComponent[0]
			}
		}

		return null
	}
}
