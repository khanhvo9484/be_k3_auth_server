import { Module } from '@nestjs/common'
import { GradeReviewController } from './grade-review.controller'
import { GradeReviewService } from './grade-review.service'
@Module({
	imports: [],
	providers: [GradeReviewService],
	controllers: [GradeReviewController]
})
export class GradeReviewModule {}
