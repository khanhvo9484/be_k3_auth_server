import { Exclude, Expose } from 'class-transformer'
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
	grade: IGrade

	@Expose()
	finalGrade: number
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
