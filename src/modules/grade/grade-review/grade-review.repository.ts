import { Injectable, Inject } from '@nestjs/common'
import { Model } from 'mongoose'
import { IGradeReview } from '../resource/shemas'
import { CreateGradeReviewRequest } from './resource/dto'
@Injectable()
export class GradeReviewRepository {
	constructor(
		@Inject('GRADE_REVIEW_MODEL') private gradeReviewModel: Model<IGradeReview>
	) {}

	async getAllStudentGradeReview(
		courseId: string,
		studentId: string
	): Promise<IGradeReview[]> {
		const result = await this.gradeReviewModel.find({
			courseId: courseId,
			studentId: studentId
		})
		return result
	}

	async getAllGradeReview(courseId: string): Promise<IGradeReview[]> {
		const result = await this.gradeReviewModel.find({ courseId: courseId })
		return result
	}

	async createGradeReview(
		request: CreateGradeReviewRequest
	): Promise<IGradeReview> {
		const result = await this.gradeReviewModel.create(request)
		return result.toJSON()
	}
}
