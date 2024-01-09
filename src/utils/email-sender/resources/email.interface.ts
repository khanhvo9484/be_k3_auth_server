export type Email = {
	from: string
	to: string
	subject: string
	body: string
}

export enum EmailTemplateType {
	VERIFY_EMAIL = 'VERIFY_EMAIL',
	RESET_PASSWORD = 'RESET_PASSWORD',
	INVITE_TO_COURSE = 'INVITE_TO_COURSE'
}
