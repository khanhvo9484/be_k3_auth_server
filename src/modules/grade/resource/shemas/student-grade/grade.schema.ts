import { generateId } from '@utils/id-helper'
import { Schema } from 'mongoose'
import { IGradeComponent } from '../grade-structure/grade-component.schema'
import { IGradeSubComponent } from '../grade-structure/grade-sub-component.schema'

export interface IGrade {
	// gradeComponent: Array<{
	// 	_id: string
	// 	name: string
	// 	percentage: number
	// 	totalGrade: number
	// 	gradeSubComponent: Array<{
	// 		gradeSubComponentId: string
	// 		gradeSubComponentName: string
	// 		percentage: number
	// 		grade: number
	// 	}>
	// }>
	gradeComponent: IGradeComponent &
		{
			totalGrade: number
			gradeSubComponent: IGradeSubComponent &
				{
					grade: number
				}[]
		}[]
}

const GradeSchema = new Schema<IGrade>({
	gradeComponent: [
		{
			_id: {
				type: String,
				required: true,
				default: () => {
					return generateId('GC')
				}
			},
			name: { type: String, required: true },
			percentage: { type: Number, required: true },
			totalGrade: { type: Number },
			gradeSubComponent: [
				{
					_id: {
						type: String,
						required: true,
						default: () => {
							return generateId('SC')
						}
					},
					name: { type: String, required: true },
					percentage: { type: Number, required: true },
					grade: { type: Number, required: true }
				}
			]
		}
	]
})

GradeSchema.set('toObject', { getters: true }).set('toJSON', {
	getters: true,
	minimize: false,
	transform: function (doc, ret, options) {
		// Create a new object to control property order
		const transformedObject: Record<string, any> = {}

		// Add 'id' property at the start
		transformedObject.id = ret._id

		// Copy other properties to the new object
		for (const key in ret) {
			if (key !== '_id' && key !== '__v') {
				transformedObject[key] = ret[key]
			}
		}

		return transformedObject
	}
})

export { GradeSchema }
