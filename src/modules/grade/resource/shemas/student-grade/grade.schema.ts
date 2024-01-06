import { Schema } from 'mongoose'

export interface IGrade {
	gradeStructure: Array<{
		gradeComponentId: string
		gradeComponentName: string
		percentage: number
		totalGrade: number
		gradeSubComponent: Array<{
			gradeSubComponentId: string
			gradeSubComponentName: string
			percentage: number
			grade: number
		}>
	}>
}

const GradeSchema = new Schema<IGrade>({
	gradeStructure: [
		{
			gradeComponentId: { type: String, required: true },
			gradeComponentName: { type: String, required: true },
			percentage: { type: Number, required: true },
			totalGrade: { type: Number },
			gradeSubComponent: [
				{
					gradeSubComponentId: { type: String, required: true },
					gradeSubComponentName: { type: String, required: true },
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
