import { GradeReview } from '@prisma/client'
import { generateId } from '@utils/id-helper'
import {
	Exclude,
	Expose,
	Transform,
	TransformFnParams
} from 'class-transformer'
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
	@IsOptional()
	id: string = generateId('GR')

	@IsOptional()
	createdAt: Date

	@IsOptional()
	updatedAt: Date

	@IsOptional()
	deletedAt: Date

	@IsNotEmpty()
	@IsString()
	studentId?: string

	@IsNotEmpty()
	@IsString()
	gradeId: string

	@IsNotEmpty()
	@IsString()
	courseId: string

	@IsNotEmpty()
	@Transform((params: TransformFnParams) => parseFloat(params.value))
	currentGrade: number = null

	@IsNotEmpty()
	@Transform((params: TransformFnParams) => parseFloat(params.value))
	expectedGrade: number = null

	@IsOptional()
	explaination: string = null

	@IsOptional()
	imgURL: string = null

	@IsOptional()
	status: string = GradeReviewStatus.PENDING
}
