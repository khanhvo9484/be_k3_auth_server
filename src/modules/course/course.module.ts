import { Module } from '@nestjs/common'
import { UsersModule } from '@user/user.module'
import { CourseService } from './course.service'
import { CourseRepository } from './course.repository'
import { CourseController } from './course.controller'

@Module({
	imports: [UsersModule],
	controllers: [CourseController],
	providers: [CourseService, CourseRepository]
})
export class CourseModule {}
