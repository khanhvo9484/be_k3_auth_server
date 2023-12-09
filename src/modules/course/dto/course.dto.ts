import { UserResponse } from '@user/dto/user.dto'
import { generateCode, generateId } from '@utils/id-helper'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCourseRequest {
	@IsString()
	id: string = generateId('CS')

	@IsString()
	name: string

	@IsOptional()
	description: string

	@IsString()
	inviteCode: string = generateCode(6)

	@IsOptional()
	@IsString()
	courseOwnerId: string
}

export class UpdateCourseRequest {
	@IsNotEmpty()
	@IsString()
	id: string

	@IsString()
	name?: string

	@IsString()
	description?: string

	@IsString()
	courseOwnerId?: string
}
export class CourseResponse {
	@Expose()
	id: string

	@Expose()
	name: string

	@Expose()
	description: string

	@Expose()
	createdAt: Date

	@Expose()
	updatedAt: Date

	@Expose()
	@Type(() => UserResponse) // Assuming you also have a UserResponse class
	courseOwner: UserResponse
}
export class JoinCourseRequest {
	@IsNotEmpty()
	@IsString()
	courseId: string

	@IsNotEmpty()
	@IsString()
	userId: string

	@IsString()
	invitationId?: string

	@IsString()
	roleInCourse?: string

	@IsString()
	inviteCode: string
}
