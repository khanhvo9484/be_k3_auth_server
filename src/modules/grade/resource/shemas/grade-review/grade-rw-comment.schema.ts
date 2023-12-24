import { Document, Schema } from 'mongoose'
import { GradeReviewStatus } from '../../enum'
import { generateId } from '@utils/id-helper'

export interface GradeReviewComment extends Document {
	_id: string
	gradeReviewId: string
	userId: string
	comment: string
	imgURL: string
	createdAt: Date
}

const GradeReviewCommentSchema = new Schema<GradeReviewComment>(
	{
		_id: {
			type: String,
			default: () => {
				return generateId('GRC')
			},
			unique: true,
			required: true
		},
		gradeReviewId: { type: String, required: true },
		userId: { type: String, required: true },
		comment: { type: String, required: true },
		imgURL: { type: String },
		createdAt: { type: Date, default: Date.now }
	},
	{ _id: false }
)
GradeReviewCommentSchema.set('toObject', { getters: true }).set('toJSON', {
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

export { GradeReviewCommentSchema }
