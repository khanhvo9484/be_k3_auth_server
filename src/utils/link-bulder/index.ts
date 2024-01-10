export function buildResetPasswordLink(
	link: string,
	token: string,
	email: string
) {
	return `${link}?token=${token}&email=${email}`
}
