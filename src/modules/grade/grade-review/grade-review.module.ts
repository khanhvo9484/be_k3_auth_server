import { GradeReviewRepository } from './grade-review.repository'
import { Module } from '@nestjs/common'
import { GradeReviewController } from './grade-review.controller'
import { GradeReviewService } from './grade-review.service'
import { CourseModule } from 'modules/course/course.module'
import { MongooseDatabaseModule } from '../resource/mongoose/mongoose.module'
import { CourseUtilModule } from 'modules/course-util/course-ulti.module'
@Module({
	imports: [MongooseDatabaseModule, CourseUtilModule],
	providers: [GradeReviewService, GradeReviewRepository],
	controllers: [GradeReviewController],
	exports: [GradeReviewService]
})
export class GradeReviewModule {}
