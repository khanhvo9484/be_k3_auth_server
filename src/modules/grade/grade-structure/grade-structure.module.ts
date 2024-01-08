import { Module } from '@nestjs/common'
import { MongooseDatabaseModule } from '../resource/mongoose/mongoose.module'
import { GradeStructureService } from './grade-structure.service'
import { GradeStructureRepository } from './grade-structure.repository'
import { GradeStructureController } from './grade-structure.controller'
import { CourseModule } from 'modules/course/course.module'
@Module({
	imports: [MongooseDatabaseModule],
	providers: [GradeStructureService, GradeStructureRepository],
	controllers: [GradeStructureController],
	exports: [GradeStructureService]
})
export class GradeStructureModule {}
