import { Module } from '@nestjs/common'
import { mongoProviders } from './mongoose.provider'
import { notificationProvider } from '../providers/notification.provider'
@Module({
	providers: [...mongoProviders, ...notificationProvider],
	exports: [...mongoProviders, ...notificationProvider]
})
export class MongooseNotificationModule {}
