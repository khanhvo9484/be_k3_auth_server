import { Injectable } from '@nestjs/common'

import { DatabaseExecutionException } from '@common/exceptions'
import { AdminRepository } from './admin.repository'
@Injectable()
export class AdminService {
	constructor(private adminRepository: AdminRepository) {}

	async getAllUsers() {
		try {
			const result = await this.adminRepository.getAllUsers()
			return result
		} catch (err) {
			console.log(err)
			throw new DatabaseExecutionException(err.message)
		}
	}

	async getAllCourses() {
		try {
			const result = await this.adminRepository.getAllCourses()
			return result
		} catch (err) {
			console.log(err)
			throw new DatabaseExecutionException(err.message)
		}
	}
}
