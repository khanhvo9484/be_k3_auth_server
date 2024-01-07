import { Document, Schema } from 'mongoose'
import { GradeReviewStatus } from '../../enum'
import { generateId } from '@utils/id-helper'

export interface IGradeReview extends Document {
	_id: string
	studentId: string
	courseId: string
	gradeId: string
	currentGrade: number
	expectedGrade: number
	explaination: string
	imgURL: string
	status: GradeReviewStatus
	createdAt: Date
}

const GradeReviewSchema = new Schema<IGradeReview>(
	{
		_id: {
			type: String,
			default: () => {
				return generateId('GR')
			},
			unique: true,
			required: true
		},
		studentId: { type: String, required: true },
		gradeId: { type: String, required: true },
		courseId: { type: String, required: true },
		currentGrade: { type: Number, required: true },
		expectedGrade: { type: Number, required: true },
		explaination: { type: String, required: true },
		imgURL: { type: String },
		status: { type: String, required: true },
		createdAt: { type: Date, default: Date.now }
	},
	{ _id: true }
)

GradeReviewSchema.set('toObject', { getters: true }).set('toJSON', {
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

export { GradeReviewSchema }
