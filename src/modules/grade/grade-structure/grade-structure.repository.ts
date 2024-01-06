import { Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { IGradeStructure } from '../resource/shemas'
import {
	CreateGradeStructureRequest,
	CreateGradeSubcomponent,
	UpdateGradeStructureRequest,
	UpdateGradeSubComponentRequest
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

	async getGradeComponentById(courseId: string, gradeComponentId: string) {
		const result = await this.gradeStructureModel.findOne(
			{
				courseId: courseId,
				'gradeComponent._id': gradeComponentId
			},
			{ 'gradeComponent.$': 1 }
		)

		if (!result) {
			return null
		}

		return result.toJSON()
	}

	async updateGradeStructure(request: UpdateGradeStructureRequest) {
		console.log(request)
		const result = await this.gradeStructureModel.updateOne(
			{
				_id: request.gradeStructureId,
				'gradeComponent._id': request.gradeComponentId
			},
			{
				$set: {
					'gradeComponent.$[element].name': request.name,
					'gradeComponent.$[element].description': request.description,
					'gradeComponent.$[element].percentage': request.percentage,
					'gradeComponent.$[element].status': request.status
				}
			},

			{
				arrayFilters: [{ 'element._id': request.gradeComponentId }]
			}
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

		// return null
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
	async updateGradeSubComponent(request: UpdateGradeSubComponentRequest) {
		const result = await this.gradeStructureModel.updateOne(
			{
				_id: request.gradeStructureId,
				'gradeComponent._id': request.gradeComponentId,
				'gradeComponent.gradeSubComponent._id': request.gradeSubComponentId
			},
			{
				$set: {
					'gradeComponent.$.gradeSubComponent.$[element].name': request.name,
					'gradeComponent.$.gradeSubComponent.$[element].description':
						request.description,
					'gradeComponent.$.gradeSubComponent.$[element].percentage':
						request.percentage,
					'gradeComponent.$.gradeSubComponent.$[element].status': request.status
				}
			},
			{
				arrayFilters: [{ 'element._id': request.gradeSubComponentId }]
			}
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
