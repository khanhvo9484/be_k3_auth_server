import SparkPost from 'sparkpost'
import { IEmailProvider } from '.'
import { Email } from './resources/email.interface'

// const sparkpostClient = new SparkPost(process.env.SPARKPOST_API_KEY,{
//     endpoint: "https://api.sparkpost.com:443"
// });

export class SparkPostSender extends SparkPost implements IEmailProvider {
	constructor() {
		super(process.env.SPARKPOST_API_KEY, {
			endpoint: 'https://api.sparkpost.com:443'
		})
	}
	async send(email: Email): Promise<any> {
		try {
			const result = await this.transmissions.send({
				content: {
					from: email.from,
					subject: email.subject
				},
				recipients: [{ address: email.to }]
			})
			return result
		} catch (e) {
			throw new Error('Cannot send email')
		}
	}
	async sendWithTemplate(
		to: string,
		templateId: string,
		substitutionData: any
	): Promise<any> {
		try {
			const result = await this.transmissions.send({
				content: {
					template_id: templateId
				},
				substitution_data: substitutionData,
				recipients: [{ address: to }]
			})
			return result
		} catch (e) {
			throw new Error('Cannot send email')
		}
	}
	async sendBroadCast(email: Email): Promise<any> {}
}
