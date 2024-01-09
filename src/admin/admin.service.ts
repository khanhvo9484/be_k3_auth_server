import { Injectable } from '@nestjs/common'

import { DatabaseExecutionException } from '@common/exceptions'
import { AdminRepository } from './admin.repository'
import { ExcelService } from '@utils/excel/excel.service'

@Injectable()
export class AdminService {
	constructor(
		private adminRepository: AdminRepository,
		private excelService: ExcelService
	) {}

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

	async banUser(userId: string) {
		try {
			const result = await this.adminRepository.blockUser(userId)
			return result
		} catch (err) {
			console.log(err)
			throw new DatabaseExecutionException(err.message)
		}
	}

	async getXlsxTemplateMappingId() {
		try {
			const users = await this.adminRepository.getAllUsers()
			const refinedUsers = users.map((item) => {
				return {
					Email: item.email,
					'Vai trò': item.role,
					'Ngày sinh': item.dob,
					MSSV: ''
				}
			})
			const sheetName = 'Sheet1'
			const result = await this.excelService.generateExcelBufferWithData(
				refinedUsers,
				sheetName
			)
			return result
		} catch (err) {
			console.log(err)
			throw new DatabaseExecutionException(err.message)
		}
	}
}
