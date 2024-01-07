import { Connection } from 'mongoose'
import { NotificationSchema } from '../schema/notification.schema'

export const notificationProvider = [
	{
		provide: 'NOTIFICATION_MODEL',
		useFactory: (connection: Connection) =>
			connection.model('Notification', NotificationSchema),
		inject: ['MONGO_CONNECTION']
	}
]
