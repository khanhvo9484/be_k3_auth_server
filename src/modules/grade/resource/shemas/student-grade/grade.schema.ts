import { generateId } from '@utils/id-helper'
import { Schema } from 'mongoose'

export interface IGrade {
	gradeComponent: Array<{
		_id: string
		name: string
		percentage: number
		totalGrade: number
		gradeSubComponent: IGradeSubComponentWithGrade[]
	}>
}

export interface IGradeSubComponentWithGrade {
	_id: string
	name: string
	percentage: number
	grade: number
}

export interface IGradeComponentWithGrade {
	_id: string
	name: string
	percentage: number
	totalGrade: number
	gradeSubComponent: IGradeSubComponentWithGrade[]
}

const GradeSubComponentWithGradeSchema =
	new Schema<IGradeSubComponentWithGrade>(
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
			grade: { type: Number }
		},
		{ _id: true }
	)

const GradeComponentWithGradeSchema = new Schema<IGradeComponentWithGrade>(
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
		totalGrade: { type: Number },
		gradeSubComponent: [GradeSubComponentWithGradeSchema]
	},
	{ _id: true }
)

const GradeSchema = new Schema<IGrade>(
	{
		gradeComponent: [GradeComponentWithGradeSchema]
	},
	{ _id: true }
)

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

GradeSubComponentWithGradeSchema.set('toObject', { getters: true }).set(
	'toJSON',
	{
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
	}
)
GradeComponentWithGradeSchema.set('toObject', { getters: true }).set('toJSON', {
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
export { GradeSchema, GradeSubComponentWithGradeSchema }
