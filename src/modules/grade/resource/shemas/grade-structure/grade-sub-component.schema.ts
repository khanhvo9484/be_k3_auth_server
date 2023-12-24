import { generateId } from '@utils/id-helper'
import { Schema } from 'mongoose'

export interface IGradeSubComponent extends Document {
	_id: string
	name: string
	status: string
	percentage: number
}

const GradeSubComponentSchema = new Schema<IGradeSubComponent>({
	_id: {
		type: String,
		default: () => {
			return generateId('SC')
		},
		index: true,
		unique: true,
		required: true
	},
	name: { type: String, required: true },
	status: { type: String, required: true },
	percentage: { type: Number, required: true }
})

GradeSubComponentSchema.set('toObject', { getters: true }).set('toJSON', {
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

export { GradeSubComponentSchema }
