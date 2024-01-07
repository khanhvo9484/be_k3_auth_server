import { GradeReviewRepository } from './grade-review.repository'
import { Module } from '@nestjs/common'
import { GradeReviewController } from './grade-review.controller'
import { GradeReviewService } from './grade-review.service'
import { CourseModule } from 'modules/course/course.module'
import { MongooseDatabaseModule } from '../resource/mongoose/mongoose.module'

@Module({
	imports: [CourseModule, MongooseDatabaseModule],
	providers: [GradeReviewService, GradeReviewRepository],
	controllers: [GradeReviewController]
})
export class GradeReviewModule {}
