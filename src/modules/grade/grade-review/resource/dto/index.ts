import { Exclude, Expose } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { GradeReviewStatus } from 'modules/grade/resource/enum'

@Exclude()
export class GradeReviewResponse {
	@Expose()
	id: string

	@Expose()
	student: any

	@Expose()
	gradeId: string

	@Expose()
	courseId: string

	@Expose()
	currentGrade: number

	@Expose()
	expectedGrade: number

	@Expose()
	explaination: string

	@Expose()
	imgURL: string

	@Expose()
	status: string

	@Expose()
	createdAt: Date
}

export class CreateGradeReviewRequest {
	@IsNotEmpty()
	@IsString()
	studentId: string

	@IsNotEmpty()
	@IsString()
	gradeId: string

	@IsNotEmpty()
	@IsString()
	courseId: string

	@IsNotEmpty()
	currentGrade: number = null

	@IsNotEmpty()
	expectedGrade: number = null

	@IsOptional()
	explaination: string = null

	@IsOptional()
	imgURL: string = null

	@IsOptional()
	status: string = GradeReviewStatus.PENDING
}
