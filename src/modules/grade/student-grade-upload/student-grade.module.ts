import { Module } from '@nestjs/common'
import { StudentGradeController } from './student-grade.controller'
import { StudentGradeService } from './student-grade.service'
import { StudentGradeRepository } from './student-grade.repository'
import { MongooseDatabaseModule } from '../resource/mongoose/mongoose.module'
import { UsersModule } from '@user/user.module'
import { CourseModule } from 'modules/course/course.module'
@Module({
	imports: [MongooseDatabaseModule, UsersModule, CourseModule],
	controllers: [StudentGradeController],
	providers: [StudentGradeService, StudentGradeRepository]
})
export class StudentGradeModule {}
