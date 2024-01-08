import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger, InternalServerErrorException } from '@nestjs/common'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import { PORT, ENVIROMENT, PROTOCOL } from './enviroment'
import { LoggerMiddleware } from './common/middleware/logger.middleware'
import { MyLogger } from './config/logger'
import { SocketIoAdapter } from './socket-io.adapter'

declare const module: any
async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
		cors: true
	})
	app.useGlobalPipes(
		new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
	)
	app.use(cookieParser())
	app.setGlobalPrefix('api/v1')
	app.enableShutdownHooks()
	// // adapter for e2e testing
	const httpAdapter = app.getHttpAdapter()

	// app.useWebSocketAdapter(new SocketIoAdapter(app))

	if (ENVIROMENT === 'development' || ENVIROMENT === 'prouction') {
		app.use(LoggerMiddleware)
	}

	const options = new DocumentBuilder()
		.setTitle('Nestjs K3 Learning')
		.setVersion('3.0.0')
		.setDescription('')
		.setExternalDoc('For more information', 'http://swagger.io')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				name: 'JWT',
				description: 'Enter JWT token',
				in: 'header'
			},
			'JWT-auth' // This name here is important for matching up with @ApiBearerAuth() in your controller!
		)
		.build()

	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api', app, document)

	await app.listen(PORT)
	Logger.log(`🚀 Server running on http://localhost:${PORT}`, 'Bootstrap')

	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}
}
bootstrap()
