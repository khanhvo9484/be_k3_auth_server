import { BullModule } from '@nestjs/bull'
import { Global, Module } from '@nestjs/common'
import { NotificationQueueService, CommentQueueService } from './producer'

import { SendNotificationConsumer } from './consumer/notification.consumer'
import { BroadcastCommentConsumer } from './consumer'
import {
	REDIS_HOST,
	REDIS_PASSWORD,
	REDIS_PORT,
	REDIS_USERNAME
} from '@enviroment/index'
@Global()
@Module({
	imports: [
		BullModule.registerQueue({
			name: 'SEND_NOTIFICATION',
			redis: {
				port: parseInt(REDIS_PORT),
				host: REDIS_HOST,
				username: REDIS_USERNAME,
				password: REDIS_PASSWORD
			}
		}),
		BullModule.registerQueue({
			name: 'BROADCAST_COMMENT',
			redis: {
				port: parseInt(REDIS_PORT),
				host: REDIS_HOST,
				username: REDIS_USERNAME,
				password: REDIS_PASSWORD
			}
		})
	],
	providers: [
		NotificationQueueService,
		CommentQueueService,
		SendNotificationConsumer,
		BroadcastCommentConsumer
	],
	exports: [NotificationQueueService, CommentQueueService]
})
export class QueueModule {}
