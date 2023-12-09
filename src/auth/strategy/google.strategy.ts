import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'
import { Injectable } from '@nestjs/common'

import { OauthLoginService } from 'auth/oauth-login.service'
import { IAuthUser } from 'auth/resources/interface'
import {
	GOOGLE_CALLBACK_URL,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET
} from '@enviroment/index'
import { generateId } from '@utils/id-helper'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(private oauthLoginService: OauthLoginService) {
		super({
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: GOOGLE_CALLBACK_URL,
			scope: ['email', 'profile']
		})
	}
	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: VerifyCallback
	): Promise<any> {
		const { displayName, emails, photos } = profile
		const user: IAuthUser = {
			id: generateId('US'),
			email: emails[0].value,
			name: displayName,
			avatar: photos[0].value,
			password: '',
			isVerified: true,
			accountType: 'google'
		}
		const authUser = await this.oauthLoginService.validateUser(user)

		done(null, authUser)
	}
}
