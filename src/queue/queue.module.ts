import { BullModule } from '@nestjs/bull'
import { Global, Module } from '@nestjs/common'
import { NotificationQueueService, CommentQueueService } from './producer'

import { SendNotificationConsumer } from './consumer/notification.consumer'
@Global()
@Module({
	imports: [
		BullModule.registerQueue({
			name: 'SEND_NOTIFICATION',
			redis: {
				port: 14427,
				host: 'redis-14427.c52.us-east-1-4.ec2.cloud.redislabs.com',
				username: 'default',
				password: 'zx9xachrpRa4dHDNKbnMsaFeUXAQFvyH'
			}
		}),
		BullModule.registerQueue({
			name: 'BROADCAST_COMMENT',
			redis: {
				port: 14427,
				host: 'redis-14427.c52.us-east-1-4.ec2.cloud.redislabs.com',
				username: 'default',
				password: 'zx9xachrpRa4dHDNKbnMsaFeUXAQFvyH'
			}
		})
	],
	providers: [
		NotificationQueueService,
		CommentQueueService,
		SendNotificationConsumer
	],
	exports: [NotificationQueueService, CommentQueueService]
})
export class QueueModule {}
