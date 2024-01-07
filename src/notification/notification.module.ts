import { Global, Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { NotificationRepository } from './notification.repository'
import { NotificationController } from './notification.controller'
import { CourseModule } from 'modules/course/course.module'

@Global()
@Module({
	imports: [CourseModule],
	providers: [NotificationService, NotificationRepository],
	controllers: [NotificationController],
	exports: [NotificationService, NotificationRepository]
})
export class NotificationModule {}
