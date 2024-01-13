import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { IAuthUser } from 'auth/resources/interface'
import { AuthService } from '../auth.service'
import { Profile, Strategy, VerifyCallback } from 'passport-facebook'
import { generateId } from '@utils/id-helper'
import { OauthLoginService } from 'auth/oauth-login.service'
import {
	FACEBOOK_CLIENT_ID,
	FACEBOOK_CLIENT_SECRET,
	FACEBOOK_CALLBACK_URL
} from '@enviroment/index'
@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
	constructor(
		private authService: AuthService,
		private oauthLoginService: OauthLoginService
	) {
		super({
			clientID: FACEBOOK_CLIENT_ID,
			clientSecret: FACEBOOK_CLIENT_SECRET,
			callbackURL: FACEBOOK_CALLBACK_URL,
			scope: 'email',
			profileFields: ['emails', 'name', 'photos']
		})
	}
	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: VerifyCallback
	): Promise<any> {
		const { name, emails, photos } = profile
		const user: IAuthUser = {
			id: generateId('US'),
			email: emails[0].value,
			name: name.givenName + ' ' + name.familyName,
			avatar: photos[0].value,
			password: '',
			isVerified: true,
			accountType: 'facebook'
		}

		const authUser = await this.oauthLoginService.validateUser(user)

		done(null, authUser)
	}
}
