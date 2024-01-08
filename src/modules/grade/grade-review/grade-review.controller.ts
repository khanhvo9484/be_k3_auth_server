import {
	Controller,
	Post,
	UseInterceptors,
	UploadedFile,
	Req,
	Get,
	Query,
	Param,
	Body
} from '@nestjs/common'
import { FileUploaderService } from '@utils/file-uploader/file-uploader.service'
import { FileInterceptor } from '@nestjs/platform-express/multer'
import { Request } from 'express'

import { GradeReviewService } from './grade-review.service'
import {
	CreateCommentOnGradeReviewRequest,
	CreateGradeReviewRequest
} from './resource/dto'

@Controller('grade-review')
export class GradeReviewController {
	constructor(
		private gradeReviewService: GradeReviewService,
		private fileUploaderService: FileUploaderService
	) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: any) {
		try {
			const result = await this.fileUploaderService.uploadFile(file)
			return {
				message: 'upload file success',
				data: result
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}

	@Get('get/:gradeReviewId')
	async getGradeReview(
		@Req() request: Request,
		@Param() param: { gradeReviewId: string }
	) {
		try {
			const result = await this.gradeReviewService.getGradeReview(
				param.gradeReviewId
			)
			return {
				message: 'get grade review success',
				data: result
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}

	@Get('all-grade-review/:courseId')
	async getAllGradeReview(
		@Req() request: Request,
		@Query('roleInCourse') roleInCourse: string,
		@Param() param: { courseId: string }
	) {
		const user = request.user
		try {
			const result = await this.gradeReviewService.getAllGradeReview(
				user,
				param.courseId,
				roleInCourse
			)
			return {
				message: 'get all grade review success',
				data: result
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}

	@UseInterceptors(FileInterceptor('file'))
	@Post('create-grade-review')
	async createGradeReview(
		@UploadedFile() file: any,
		@Req() request: Request,
		@Body() body: CreateGradeReviewRequest
	) {
		try {
			const result = await this.gradeReviewService.createGradeReview(body, file)
			return {
				message: 'create grade review success',
				data: result
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}

	@Post('comment-on-grade-review')
	async commentOnGradeReview(
		@Req() request: Request,
		@Body() body: CreateCommentOnGradeReviewRequest
	) {
		try {
			const result = await this.gradeReviewService.commentOnGradeReview(body)
			return {
				message: 'comment on grade review success',
				data: result
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}
