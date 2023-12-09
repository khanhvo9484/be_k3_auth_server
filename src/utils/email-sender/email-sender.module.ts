import { DynamicModule, Module } from '@nestjs/common'
import { EmailSenderService } from './email-sender.service'
import { SparkPostSender } from './sparkpost'

@Module({})
export class EmailSenderModule {
	static register(options: Record<string, any>): DynamicModule {
		return {
			module: EmailSenderModule,
			imports: [],
			providers: [
				{
					provide: 'EMAIL_SENDER_OPTIONS',
					useValue: options
				},
				EmailSenderService
			],
			exports: [EmailSenderService],
			global: options.isGlobal || false
		}
	}
}
