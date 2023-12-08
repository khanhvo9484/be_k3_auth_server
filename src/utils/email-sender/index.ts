import { Email } from './resources/email.interface'
import { SparkPostSender } from './sparkpost'

export interface IEmailProvider {
	send(email: Email): Promise<any>
	sendWithTemplate(
		to: string,
		templateId: string,
		substitutionData: any
	): Promise<any>
}

export class EmailSender {
	private emailProvider: IEmailProvider
	constructor() {
		this.emailProvider = new SparkPostSender()
	}
	async send(email: Email) {
		const result = await this.emailProvider.send(email)
		return result
	}
	async sendWithTemplate(
		to: string,
		templateId: string,
		substitutionData: any
	) {
		const result = await this.emailProvider.sendWithTemplate(
			to,
			templateId,
			substitutionData
		)
		return result
	}
}
