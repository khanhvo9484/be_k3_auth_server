export enum EmailTempateId {
	VERIFICATION = 'final-email-verification',
	FORGOT_PASSWORD = 'final-email-forgot-password',
	INVITE_TO_COURSE = 'final-invite-to-course'
}
export type VerificationEmailSubstitution = {
	verify_link: string
	protocol: string
}

export type InviteToCourseSubstitution = {
	invitation_link: string
	protocol: string
	inviter_name: string
	inviter_email: string
	course_name: string
	role_in_course: string
}

export type ForgotPasswordSubstitution = {
	reset_password_link: string
	protocol: string
}
