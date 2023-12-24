import { Global, Module } from '@nestjs/common'
import { MongooseNotificationModule } from './resource/mongoose/mongoose.module'
import { NotificationService } from './notification.service'
import { NotificationRepository } from './notification.repository'
import { NotificationController } from './notification.controller'

@Global()
@Module({
	imports: [MongooseNotificationModule],
	providers: [NotificationService, NotificationRepository],
	controllers: [NotificationController],
	exports: [NotificationService, NotificationRepository]
})
export class NotificationModule {}
