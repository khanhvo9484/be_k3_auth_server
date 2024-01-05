import { Module } from '@nestjs/common'
import { GradeStructureModule } from './grade-structure/grade-structure.module'
import { StudentGradeModule } from './student-grade-upload/student-grade.module'
@Module({
	imports: [GradeStructureModule, StudentGradeModule],
	providers: [],
	controllers: []
})
export class GradeModule {}
