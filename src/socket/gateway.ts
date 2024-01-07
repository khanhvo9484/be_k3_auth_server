import { OnModuleInit } from '@nestjs/common'
import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server } from 'socket.io'
@WebSocketGateway()
export class MyGateway implements OnModuleInit {
	@WebSocketServer() server: Server

	@SubscribeMessage('newmessage')
	handleMessage(client: any, payload: any, @MessageBody() messageBody: any) {
		console.log(messageBody)
		console.log('hehe')
		this.server.emit('onMessage', 'kakaka')
	}

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket.id)
			console.log('connected')
		})
	}
}
