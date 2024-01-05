import { Schema } from 'mongoose'
import { GradeComponentSchema, IGradeComponent } from './grade-component.schema'
import { generateId } from '@utils/id-helper'
export interface IGradeStructure extends Document {
	_id: string
	courseId: string
	gradeComponent: IGradeComponent[]
	status: string
}

const GradeStructureSchema = new Schema<IGradeStructure>(
	{
		_id: {
			type: String,
			default: () => {
				return generateId('GS')
			},
			index: true,
			unique: true,
			required: true
		},

		courseId: { type: String, required: true },
		gradeComponent: [GradeComponentSchema],
		status: { type: String, required: true }
	},
	{ _id: true }
)

GradeStructureSchema.set('toObject', { getters: true }).set('toJSON', {
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

export { GradeStructureSchema }
