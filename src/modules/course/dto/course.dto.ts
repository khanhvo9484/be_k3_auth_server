import { generateCode, generateId } from '@utils/id-helper'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCourseRequest {
	@IsNotEmpty()
	@IsString()
	id: string = generateId('CS')

	@IsNotEmpty()
	@IsString()
	name: string

	@IsNotEmpty()
	@IsString()
	courseOwnerId: string

	description?: string
	inviteCode: string = generateCode(6)
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
