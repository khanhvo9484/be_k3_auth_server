import { generateCode, generateId } from '@utils/id-helper'
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
