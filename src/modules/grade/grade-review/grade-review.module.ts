import { StudentGradeModule } from 'modules/grade/student-grade-upload/student-grade.module'
import { GradeReviewRepository } from './grade-review.repository'
import { Module } from '@nestjs/common'
import { GradeReviewController } from './grade-review.controller'
import { GradeReviewService } from './grade-review.service'
import { MongooseDatabaseModule } from '../resource/mongoose/mongoose.module'
import { CourseUtilModule } from 'modules/course-util/course-ulti.module'
import { GradeReviewCommentService } from './grade-review-comment.service'
import { GatewayModule } from '@my-socket-io/gateway.module'
@Module({
	imports: [
		MongooseDatabaseModule,
		CourseUtilModule,
		StudentGradeModule,
		GatewayModule
	],
	providers: [
		GradeReviewService,
		GradeReviewRepository,
		GradeReviewCommentService
	],
	controllers: [GradeReviewController],
	exports: [GradeReviewService]
})
export class GradeReviewModule {}
