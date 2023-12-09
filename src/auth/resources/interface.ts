interface RefreshTokenRequest {
	refresh_token: string
}

export type AcccountType = 'google' | 'facebook' | 'local'

export interface IAuthUser {
	id: string
	name: string
	email: string
	avatar: string
	password: string
	isVerified?: boolean
	accountType: AcccountType
}
