import { Email } from './resources/email.interface'
import { SparkPostSender } from './sparkpost'

export interface IEmailProvider {
	send(email: Email): Promise<any>
	sendWithTemplate(params: {
		to: string
		templateId: string
		substitutionData: any
	}): Promise<any>
}

export class EmailSenderService {
	private emailProvider: IEmailProvider
	// private emailProvider: any
	constructor() {
		this.emailProvider = new SparkPostSender()
	}
	async send(email: Email) {
		const result = await this.emailProvider.send(email)
		return result
	}
	async sendWithTemplate(params: {
		to: string
		templateId: string
		substitutionData: any
	}) {
		const { to, templateId, substitutionData } = params
		const result = await this.emailProvider.sendWithTemplate({
			to,
			templateId,
			substitutionData
		})
		return result
	}
}
