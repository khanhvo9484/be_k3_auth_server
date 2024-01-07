import { plainToClass } from 'class-transformer'

import { CourseService } from 'modules/course/course.service'
import { GradeReviewRepository } from './grade-review.repository'
import { Injectable } from '@nestjs/common'
import { IGradeReview } from '../resource/shemas'
import { CreateGradeReviewRequest, GradeReviewResponse } from './resource/dto'
import { DatabaseExecutionException } from '@common/exceptions'
import { FileUploaderService } from '@utils/file-uploader/file-uploader.service'

@Injectable()
export class GradeReviewService {
	constructor(
		private gradeReviewRepository: GradeReviewRepository,
		private courseService: CourseService,
		private fileUploaderService: FileUploaderService
	) {}

	async getAllGradeReview(
		user: CustomJwtPayload,
		courseId: string,
		roleInCourse: string
	) {
		try {
			let result: IGradeReview[]
			if (roleInCourse === 'student') {
				result = await this.gradeReviewRepository.getAllStudentGradeReview(
					courseId,
					user.id
				)
			} else {
				result = await this.gradeReviewRepository.getAllGradeReview(courseId)
				return result
			}
			if (!result) {
				throw new Error('not found')
			} else {
				return result.map((item) => {
					plainToClass(GradeReviewResponse, item.toJSON())
				})
			}
		} catch (error) {
			console.log(error)
			throw new DatabaseExecutionException(error.message)
		}
	}

	async createGradeReview(request: CreateGradeReviewRequest, file: any) {
		try {
			if (file) {
				const result = await this.fileUploaderService.uploadFile(file)
				request.imgURL = result
			}
			const result = await this.gradeReviewRepository.createGradeReview(request)
			if (!result) {
				throw new Error('cannot create grade review')
			} else {
				return plainToClass(GradeReviewResponse, result)
			}
		} catch (error) {
			console.log(error)
			throw new DatabaseExecutionException(error.message)
		}
	}
}
