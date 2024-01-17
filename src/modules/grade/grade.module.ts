import { Module } from '@nestjs/common'
import { GradeStructureModule } from './grade-structure/grade-structure.module'
import { StudentGradeModule } from './student-grade-upload/student-grade.module'
import { GradeReviewModule } from './grade-review/grade-review.module'
@Module({
	imports: [StudentGradeModule, GradeReviewModule, GradeStructureModule],
	providers: [],
	controllers: []
})
export class GradeModule {}
