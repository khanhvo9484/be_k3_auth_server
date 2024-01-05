import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	Length,
	ValidateNested
} from 'class-validator'
import { generateId } from '@utils/id-helper'
import { GradeStructureStatus } from '../../../resource/enum'
import { Expose, Transform, TransformFnParams, Type } from 'class-transformer'
export class CreateGradeStructureRequest {
	@IsOptional()
	name: string

	@IsOptional()
	description: string

	@IsNotEmpty()
	@Length(10, 12)
	courseId: string

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => GradeComponent)
	gradeComponent: GradeComponent[]

	@IsOptional()
	status: string = GradeStructureStatus.IS_NOT_GRADED
}
export class GradeComponent {
	@IsNotEmpty()
	name: string

	@IsOptional()
	description: string

	@IsNotEmpty()
	@Transform((params: TransformFnParams) => parseInt(params.value))
	percentage: number

	@IsNotEmpty()
	order: number

	@IsOptional()
	status: string = GradeStructureStatus.IS_NOT_GRADED
}

export class GradeSubComponent {
	@IsNotEmpty()
	name: string

	@IsOptional()
	description: string

	@IsNotEmpty()
	@Transform((params: TransformFnParams) => parseInt(params.value))
	percentage: number

	@IsOptional()
	status: string = GradeStructureStatus.IS_NOT_GRADED
}

export class GradeStructureResponse {
	@Expose()
	id: string
	@Expose()
	name: string
	@Expose()
	description: string
	@Expose()
	courseId: string
	@Expose()
	gradeComponent: GradeComponent[]
	@Expose()
	status: string
}

export class UpdateGradeStructureRequest {
	@IsNotEmpty()
	id: string

	@IsOptional()
	courseId: string

	@IsOptional()
	description: string

	@IsNotEmpty()
	gradeComponent: GradeComponent[]

	@IsOptional()
	status: string = GradeStructureStatus.IS_NOT_GRADED
}

export class CreateGradeSubcomponent {
	@IsNotEmpty()
	gradeStructureId: string

	@IsNotEmpty()
	gradeComponentId: string

	@IsNotEmpty()
	name: string

	@IsOptional()
	description: string

	@IsNotEmpty()
	@Transform((params: TransformFnParams) => parseInt(params.value))
	percentage: number

	@IsOptional()
	status: string = GradeStructureStatus.IS_NOT_GRADED
}

export class UpdateGradeSubComponentRequest {
	@IsNotEmpty()
	gradeStructureId: string

	@IsNotEmpty()
	gradeComponentId: string

	@IsNotEmpty()
	gradeSubComponentId: string

	@IsOptional()
	name: string

	@IsOptional()
	description: string

	@IsOptional()
	@Transform((params: TransformFnParams) => parseInt(params.value))
	percentage: number

	@IsOptional()
	status: string = GradeStructureStatus.IS_NOT_GRADED
}
