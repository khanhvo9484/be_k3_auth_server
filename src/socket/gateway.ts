import { Inject, OnModuleInit, forwardRef } from '@nestjs/common'
import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'

import { Server } from 'socket.io'
import { SocketClientInfo } from '@my-socket-io/resource/dto'
import { NotificationService } from 'notification/notification.service'

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
			connectedUsers.forEach((user) => {
				if (user.userId === userInList.userId) {
					this.server
						.to(user.socketId)
						.emit('onReceiveNotification', JSON.stringify(notification))
				}
			})
		})
	}

	@SubscribeMessage('joinPost')
	handleJoinPost(
		client: any,
		payload: any,
		@MessageBody() messageBody: { postId: string }
	) {
		// Join the specified room
		client.join(messageBody.postId)

		// You can emit an event or perform other actions as needed
		this.server
			.to(client.id)
			.emit('joinedPost', `Joined post: ${messageBody.postId}`)
	}

	broadcastInPost(postId: string, data: any) {
		this.server.to(postId).emit('onReceiveNewComment', data)
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

			socket.on('joinPost', (payload: { postId: string }) => {
				// Call the handleJoinRoom method to join the room
				this.handleJoinPost(socket, payload, { postId: payload.postId })
			})
		})
	}
}
