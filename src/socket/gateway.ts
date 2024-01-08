import { Inject, OnModuleInit, forwardRef } from '@nestjs/common'
import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { Server } from 'socket.io'
import { SocketClientInfo } from '@my-socket-io/resource/dto'
import { NotificationService } from 'notification/notification.service'
import { connect } from 'http2'

const connectedUsers: SocketClientInfo[] = []

@WebSocketGateway({ cors: true })
export class MyGatewayService implements OnModuleInit {
	constructor(
		@Inject(forwardRef(() => NotificationService))
		private notificationService: NotificationService
	) {}
	@WebSocketServer() server: Server

	@SubscribeMessage('message')
	handleMessage(client: any, payload: any, @MessageBody() messageBody: any) {
		this.server.emit('onMessage', messageBody)
		this.server.emit('welcome', payload)
	}

	@SubscribeMessage('setNotificationIsRead')
	async setNotificationIsRead(
		client: any,
		payload: any,
		@MessageBody() messageBody: { userId: string }
	) {
		const result = await this.notificationService.setIsRead(messageBody)
		this.server.emit('onSetNotificationIsRead', result)
	}

	pushNotification(userId: string, notification: any) {
		const user = connectedUsers.find((user) => user.userId === userId)
		if (user) {
			this.server
				.to(user.socketId)
				.emit('onReceiveNotification', JSON.stringify(notification))
		}
	}

	broadcastNotification(userList: { userId: string }[], notification: any) {
		userList.forEach((userInList) => {
			connectedUsers.map((user) => {
				if (user.userId === userInList.userId) {
					this.server
						.to(user.socketId)
						.emit('onReceiveNotification', JSON.stringify(notification))
				}
			})
		})
	}

	onModuleInit() {
		this.server.on('connection', (socket) => {
			const query = socket.handshake.query
			const user: SocketClientInfo = {
				userId: query.userId as string,
				socketId: socket.id
			}
			if (!user.userId) {
				return
			}
			connectedUsers.push(user)
			console.info(
				`A new user has connected: (${connectedUsers.length}) `,
				user
			)

			socket.on('disconnect', () => {
				const index = connectedUsers.findIndex(
					(user) => user.socketId === socket.id
				)
				connectedUsers.splice(index, 1)
				console.info(
					`A user has disconnected: (${connectedUsers.length}) `,
					user
				)
			})
		})
	}
}
