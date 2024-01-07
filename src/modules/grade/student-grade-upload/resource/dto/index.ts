import {
	Exclude,
	Expose,
	Transform,
	TransformFnParams
} from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { IGrade } from 'modules/grade/resource/shemas'

@Exclude()
export class CreateStudentGradeDto {
	@Expose()
	courseId: string

	@Expose({ name: 'MSSV' })
	@IsOptional()
	studentOfficialId: string

	@Expose({ name: 'Họ và tên' })
	fullName: string

	@Expose()
	@IsOptional()
	grade: IGrade = null

	@Expose()
	finalGrade: number = null
}

@Exclude()
export class CreateStudentMappingIdDto {
	@Expose({ name: 'MSSV' })
	@IsNotEmpty()
	@IsString()
	studentOfficialId: string

	@Expose({ name: 'Email' })
	@IsNotEmpty()
	@IsString()
	email: string
}

@Exclude()
export class AddGradeStudentDto {
	@Expose()
	gradeStructure: {
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
	@Expose()
	@IsOptional()
	fullName: string

	@Expose()
	courseId: string

	@Expose()
	studentOfficialId: string

	@Expose()
	@IsString()
	@Transform((params: TransformFnParams) => parseFloat(params.value))
	finalGrade: number
}

@Exclude()
export class StudentGradeComponent {
	@Expose()
	@IsNotEmpty()
	@IsString()
	gradeComponentId: string

	@Expose()
	@IsNotEmpty()
	@IsString()
	gradeComponentName: string

	@Expose()
	@IsNotEmpty()
	@IsString()
	@Transform((params: TransformFnParams) => parseFloat(params.value))
	totalGrade: number

	@Expose()
	@IsNotEmpty()
	@IsString()
	gradeSubComponent: StudentGradeSubComponent[]
}

@Exclude()
export class StudentGradeSubComponent {
	@Expose()
	@IsNotEmpty()
	@IsString()
	gradeSubComponentId: string

	@Expose()
	@IsNotEmpty()
	@IsString()
	gradeSubComponentName: string

	@Expose()
	@IsNotEmpty()
	@IsString()
	@Transform((params: TransformFnParams) => parseFloat(params.value))
	grade: number
}

export class DataFromExcelFile {
	@Expose({ name: 'MSSV' })
	studentOfficialId: string

	@Expose({ name: 'Họ và tên' })
	fullName: string;

	[key: string]: any
}
