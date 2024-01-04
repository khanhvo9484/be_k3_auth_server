import { Document, Schema } from 'mongoose'
import {
	IGradeSubComponent,
	GradeSubComponentSchema
} from './grade-sub-component.schema'
import { generateId } from '@utils/id-helper'

export interface IGradeComponent extends Document {
	_id: string
	name: string
	percentage: number
	status: string
	order: number
	gradeSubComponent: IGradeSubComponent[]
}

const GradeComponentSchema = new Schema<IGradeComponent>(
	{
		_id: {
			type: String,
			default: () => {
				return generateId('GC')
			},
			unique: true,
			required: true
		},
		name: { type: String, required: true },
		percentage: { type: Number, required: true },
		status: { type: String, required: true },
		order: { type: Number, required: true },
		gradeSubComponent: [GradeSubComponentSchema]
	},
	{ _id: false }
)

GradeComponentSchema.set('toObject', { getters: true }).set('toJSON', {
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

export { GradeComponentSchema }
