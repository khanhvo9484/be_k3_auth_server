import { Module } from '@nestjs/common'
import { GradeStructureModule } from './grade-structure/grade-structure.module'
import { StudentGradeModule } from './student-grade-upload/student-grade.module'
import { GradeReviewModule } from './grade-review/grade-reiview.module'
@Module({
	imports: [GradeStructureModule, StudentGradeModule, GradeReviewModule],
	providers: [],
	controllers: []
})
export class GradeModule {}
