import { Module } from '@nestjs/common'
import { MongooseDatabaseModule } from '../resource/mongoose/mongoose.module'
import { GradeStructureService } from './grade-structure.service'
import { GradeStructureRepository } from './grade-structure.repository'
import { GradeStructureController } from './grade-structure.controller'
import { CourseUtilModule } from 'modules/course-util/course-ulti.module'
@Module({
	imports: [MongooseDatabaseModule, CourseUtilModule],
	providers: [GradeStructureService, GradeStructureRepository],
	controllers: [GradeStructureController],
	exports: [GradeStructureService]
})
export class GradeStructureModule {}
