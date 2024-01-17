export type Email = {
	from: string
	to: string
	subject: string
	body: string
}

export enum EmailTemplateType {
	VERIFY_EMAIL = 'final-email-verification',
	RESET_PASSWORD = 'final-email-forgot-password',
	INVITE_TO_COURSE = 'final-invite-to-course'
}

export interface VerifyEmailPayload {
	verify_link: string
	protocol: string
}
export interface ResetPasswordPayload {
	reset_password_link: string
	protocol: string
}
export interface InviteToCourseEmailSenderPayload {
	invitation_link: string
	protocol: string
	inviter_name: string
	inviter_email: string
	course_name: string
	role_in_course: string
}
