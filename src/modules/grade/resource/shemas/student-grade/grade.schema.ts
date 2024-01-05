import { Schema } from 'mongoose'

export interface IGrade {
	gradeComponent: Array<{
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

export const GradeSchema = new Schema<IGrade>({
	gradeComponent: [
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
