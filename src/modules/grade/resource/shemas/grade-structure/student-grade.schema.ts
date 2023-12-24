import { Document, Schema } from 'mongoose'
import { IGrade, GradeSchema } from './grade.schema'

export interface IStudentGrade extends Document {
	courseId: string
	studentId: string
	grade: IGrade
	finalGrade: number
}

export const StudentGradeSchema = new Schema<IStudentGrade>({
	courseId: { type: String, required: true },
	studentId: { type: String, required: true },
	grade: { type: GradeSchema, required: true },
	finalGrade: { type: Number }
})
