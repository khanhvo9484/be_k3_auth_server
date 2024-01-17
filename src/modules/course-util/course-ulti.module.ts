import { Module } from '@nestjs/common'
import { CourseUtilService } from './course-util.service'
@Module({
	imports: [],
	providers: [CourseUtilService],
	controllers: [],
	exports: [CourseUtilService]
})
export class CourseUtilModule {}
