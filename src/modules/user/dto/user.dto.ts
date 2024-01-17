import { Exclude, Expose, Type } from 'class-transformer'

import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator'
import { generateId } from '@utils/id-helper'
import { User } from '@prisma/client'

class CreateUserRequest {
	@IsString()
	id: string = generateId('US')

	@IsString()
	@IsNotEmpty({ message: 'Name is required' })
	name: string

	@IsEmail({}, { message: 'Invalid email' })
	@IsString()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty({ message: 'Password is required' })
	password: string

	@IsOptional()
	@IsString()
	role: string

	@IsOptional()
	@IsString()
	avatar: string

	@Type(() => Date)
	@IsNotEmpty({ message: 'Date of birth is required' })
	dob: Date
}
class SignInRequest {
	@IsEmail({}, { message: 'Invalid email' })
	@IsString()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty({ message: 'Password is required' })
	password: string

	constructor(email: string, password: string) {
		this.email = email
		this.password = password
	}
}

class UpdateUserRequest {
	@IsOptional()
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	avatar: string

	@IsOptional()
	@Type(() => Date)
	@IsNotEmpty({ message: 'Date of birth is required' })
	dob: Date

	@IsOptional()
	@IsString()
	bio: string

	@IsOptional()
	@IsString()
	phoneNumber: string

	@IsOptional()
	@IsString()
	studentOfficialId: string
}

class UpdateUserByAdminRequest implements User {
	id: string
	email: string
	password: string
	createdAt: Date
	updatedAt: Date
	deletedAt: Date
	isSuspensed: boolean
	@IsOptional()
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	avatar: string

	@IsOptional()
	@Type(() => Date)
	@IsNotEmpty({ message: 'Date of birth is required' })
	dob: Date

	@IsOptional()
	@IsString()
	bio: string

	@IsOptional()
	@IsString()
	phoneNumber: string

	@IsOptional()
	@IsString()
	role: string

	@IsOptional()
	@IsString()
	studentOfficialId: string

	@IsOptional()
	@IsString()
	isVerified: boolean

	@IsOptional()
	@IsString()
	isBlocked: boolean

	@IsOptional()
	@IsString()
	isSuspended: boolean

	@IsOptional()
	@IsString()
	accountType: string
}

@Exclude()
class UserResponse {
	@Expose()
	id: string
	@Expose()
	name: string
	@Expose()
	email: string

	@Expose()
	role: string

	@Expose()
	avatar: string

	@Expose()
	bio: string

	@Expose()
	phoneNumber: string

	@Expose()
	createdAt: Date

	@Expose()
	updatedAt: Date

	@Expose()
	dob: Date

	@Expose()
	studentOfficialId: string

	@Expose()
	isVerified: boolean

	@Expose()
	isBlocked: boolean

	@Expose()
	isSuspended: boolean

	@Expose()
	accountType: string
}
export { CreateUserRequest, SignInRequest, UserResponse, UpdateUserRequest }
export default CreateUserRequest
