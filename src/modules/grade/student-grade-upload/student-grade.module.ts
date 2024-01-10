import { Module } from '@nestjs/common'
import { StudentGradeController } from './student-grade.controller'
import { StudentGradeService } from './student-grade.service'
import { StudentGradeRepository } from './student-grade.repository'
import { MongooseDatabaseModule } from '../resource/mongoose/mongoose.module'
import { UsersModule } from '@user/user.module'
import { CourseModule } from 'modules/course/course.module'
import { GradeStructureModule } from '../grade-structure/grade-structure.module'
@Module({
	imports: [
		MongooseDatabaseModule,
		UsersModule,
		CourseModule,
		GradeStructureModule
	],
	controllers: [StudentGradeController],
	providers: [StudentGradeService, StudentGradeRepository],
	exports: [StudentGradeService]
})
export class StudentGradeModule {}
