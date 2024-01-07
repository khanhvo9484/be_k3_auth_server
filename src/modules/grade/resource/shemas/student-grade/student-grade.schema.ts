import { Document, Schema } from 'mongoose'
import { IGrade, GradeSchema } from './grade.schema'
import { GradeStructureStatus } from '../../enum'
import { generateId } from '@utils/id-helper'

export interface IStudentGrade extends Document {
	_id: string
	courseId: string
	studentOfficialId: string
	fullName: string
	grade: IGrade
	finalGrade: number
	status: string
}

const StudentGradeSchema = new Schema<IStudentGrade>(
	{
		_id: {
			type: String,
			default: () => {
				return generateId('SG')
			}
		},
		courseId: { type: String, required: true },
		studentOfficialId: { type: String, required: true },
		fullName: { type: String, required: true },
		grade: { type: GradeSchema },
		finalGrade: { type: Number },
		status: {
			type: String,
			default: () => {
				return GradeStructureStatus.IS_NOT_GRADED
			}
		}
	},
	{ _id: true }
)

StudentGradeSchema.set('toObject', { getters: true }).set('toJSON', {
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

export { StudentGradeSchema }
