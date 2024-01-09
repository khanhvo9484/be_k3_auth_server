import { GradeReviewRepository } from './grade-review.repository'
import { Module } from '@nestjs/common'
import { GradeReviewController } from './grade-review.controller'
import { GradeReviewService } from './grade-review.service'
import { MongooseDatabaseModule } from '../resource/mongoose/mongoose.module'
import { CourseUtilModule } from 'modules/course-util/course-ulti.module'
import { GradeReviewCommentService } from './grade-review-comment.service'
@Module({
	imports: [MongooseDatabaseModule, CourseUtilModule],
	providers: [
		GradeReviewService,
		GradeReviewRepository,
		GradeReviewCommentService
	],
	controllers: [GradeReviewController],
	exports: [GradeReviewService]
})
export class GradeReviewModule {}
