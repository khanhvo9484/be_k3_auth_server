import { OauthLoginService } from 'auth/oauth-login.service'
import { plainToClass } from 'class-transformer'
import {
	Body,
	Controller,
	Get,
	HttpCode,
	Inject,
	Param,
	Post,
	Req,
	Res,
	UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { BadRequestException } from '@nestjs/common'
import { Request, Response } from 'express'
import CreateUserRequest, {
	SignInRequest,
	UserResponse
} from '@user/dto/user.dto'
import { AuthGuard as AuthGuardPassport } from '@nestjs/passport/dist'
import { Public } from '@common/decorator'
import { RefreshTokenRequest } from './resources/dto'
import { SUCCESS_OAUTH_LOGIN_PAGE_URL } from '@enviroment/index'

@Public()
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private oauthLoginService: OauthLoginService
	) {}

	@Post('/sign-up')
	async signUp(@Body() request: CreateUserRequest, @Res() res: Response) {
		const result = await this.authService.signUp(request)
		return res.status(201).json({
			message: 'Sign up successfully',
			data: plainToClass(UserResponse, result)
		})
	}

	@Post('/sign-in')
	async signIn(@Body() request: SignInRequest, @Res() res: Response) {
		const result = await this.authService.signIn(request)
		return res.status(200).json({
			message: 'Sign in successfully',
			data: result
		})
	}

	@Post('/refresh-token/sign-out')
	async signOut(
		@Req() req: Request,
		@Res() res: Response,
		@Body() body: { refresh_token: string }
	) {
		const refreshToken = body.refresh_token
		await this.authService.signOut(refreshToken)
		return res.status(200).json({
			message: 'Sign out successfully',
			data: {}
		})
	}

	@Post('/refresh-token/refresh')
	async refreshToken(
		@Req() req: Request,
		@Res() res: Response,
		@Body() body: RefreshTokenRequest
	) {
		const refreshToken = body.refresh_token
		if (!refreshToken) {
			throw new BadRequestException('Invalid refresh token')
		}
		const result = await this.authService.refreshToken(refreshToken)
		return res
			.status(200)
			.json({ message: 'Refresh token successfully', data: result })
	}

	@Get('google')
	@UseGuards(AuthGuardPassport('google'))
	async googleLogin() {}

	@Get('google/callback')
	@UseGuards(AuthGuardPassport('google'))
	async googleAuthCallback(@Req() request, @Res() response: Response) {
		const user = request.user
		const data = await this.oauthLoginService.authLogin(user)
		const userId = data.user.id
		const url_redirect =
			SUCCESS_OAUTH_LOGIN_PAGE_URL + `?iduser=${data.user.id}`
		response.redirect(url_redirect)
	}

	@Get('/verify-login/:idUser')
	async verifyLoginByUserID(
		@Res() response: Response,
		@Param('idUser') idUser: string
	) {
		const dataCache = await this.oauthLoginService.verifyLoginByUserID(idUser)

		return response.status(200).json({
			message: '',
			data: dataCache
		})
	}
	@Get('/protected')
	async protected() {
		return {
			message: 'Protected route',
			data: {}
		}
	}

	@Post('/forgot-password')
	async forgotPassword(
		@Body() request: { email: string },
		@Res() res: Response
	) {
		const { email } = request
		const result = await this.authService.sendEmailForgotPassword(email)

		return res
			.status(200)
			.json({ message: 'Reset password successfully', data: result })
	}

	@Post('/verify-reset-password')
	async verifyResetPassword(
		@Body() request: { token: string; email: string },
		@Res() res: Response
	) {
		const { token, email } = request
		const result = await this.authService.verifyResetPassword(email, token)

		return res
			.status(200)
			.json({ message: 'Verify reset password successfully', data: result })
	}

	@Post('/reset-password')
	async resetPassword(
		@Body() request: { email: string; password: string },
		@Res() res: Response
	) {
		const { email, password } = request
		const result = await this.authService.resetPassword(email, password)

		return res
			.status(200)
			.json({ message: 'Reset password successfully', data: result })
	}

	@Post('/send-verify-email')
	async sendVerifyEmail(
		@Body() request: { email: string },
		@Res() res: Response
	) {
		const { email } = request
		const result = await this.authService.sendVerifyEmail(email)

		return res
			.status(200)
			.json({ message: 'Send verify email successfully', data: result })
	}
}

//   @Post('/forgot-password')
//   async forgotPassword(
//     @Body() request: { email: string },
//     @Res() res: Response,
//   ) {
//     const { email } = request;
//     const result = await this.authService.forgotPassword(email);

//     return res
//       .status(200)
//       .json({ message: 'Reset password successfully', data: result });
//   }

//   @Post('/verify-reset-password')
//   async verifyResetPassword(
//     @Body() request: { token: string; email: string },
//     @Res() res: Response,
//   ) {
//     const { token, email } = request;
//     const result = await this.authService.verifyResetPassword(email, token);

//     return res
//       .status(200)
//       .json({ message: 'Verify reset password successfully', data: result });
//   }

//   @Post('/reset-password')
//   async resetPassword(
//     @Body() request: { email: string; password: string },
//     @Res() res: Response,
//   ) {
//     const { email, password } = request;
//     const result = await this.authService.resetPassword(email, password);

//     return res
//       .status(200)
//       .json({ message: 'Reset password successfully', data: result });
//   }
//   @Post('/sign-in')
//   async signIn(@Body() request: SignInRequest, @Res() res: Response) {
//     const result = await this.authService.logIn(request);

//     return res.status(200).json({
//       message: 'Sign in successfully',
//       data: result,
//     });
//   }

//   @Post('/refresh-token/refresh')
//   async refreshToken(
//     @Req() req: Request,
//     @Res() res: Response,
//     @Body() body: any,
//   ) {
//     const refreshToken = body.refresh_token;

//     if (!refreshToken) {
//       throw new BadRequestException('Invalid refresh token');
//     }

//     const result = await this.authService.refreshToken(refreshToken);
//     return res
//       .status(200)
//       .json({ message: 'Refresh token successfully', data: result });
//   }

//   @Post('/refresh-token/sign-out')
//   async signOut(@Req() req: Request, @Res() res: Response, @Body() body: any) {
//     const refreshToken = body.refresh_token;
//     await this.authService.signOut(refreshToken);

//     return res.status(200).json({
//       message: 'Sign out successfully',
//       data: {},
//     });
//   }

//   @Get('google')
//   @UseGuards(AuthGuardPassport('google'))
//   async googleLogin() {}

//   @Get('google/callback')
//   @UseGuards(AuthGuardPassport('google'))
//   async googleAuthCallback(@Req() request, @Res() response: Response) {
//     const user = request.user;
//     const data = await this.authService.authLogin(user);
//     const userId = data.user.id;
//     const url_redirect =
//       this.config.get('FRONTEND_URL') +
//       SUCCESS_PAGE_URL +
//       `?iduser=${data.user.id}`;

//     await this.cache.set('user_oauth_' + userId, data);
//     response.redirect(url_redirect);
//   }

//   @Get('facebook')
//   @UseGuards(AuthGuardPassport('facebook'))
//   async facebookLogin() {}

//   @Get('facebook/callback')
//   @UseGuards(AuthGuardPassport('facebook'))
//   async facebookAuthCallback(@Req() request, @Res() response: Response) {
//     const user = request.user;
//     const data = await this.authService.authLogin(user);
//     const userId = data.user.id;
//     const url_redirect =
//       this.config.get('FRONTEND_URL') +
//       SUCCESS_PAGE_URL +
//       `?iduser=${data.user.id}`;

//     await this.cache.set('user_oauth_' + userId, data);

//     response.redirect(url_redirect);
//   }

//   @Get('/verify-login/:idUser')
//   async verifyLoginByUserID(
//     @Res() response: Response,
//     @Param('idUser') idUser: string,
//   ) {
//     const dataCache = await this.authService.verifyLoginByUserID(idUser);

//     return response.status(200).json({
//       message: '',
//       data: dataCache,
//     });
//   }

//   @Get('/test')
//   @HttpCode(200)
//   testGuard() {
//     return {
//       message: 'Test reponse',
//       data: { hehe: 'hehe' },
//     };
//   }

//   @Get('/send-test-email')
//   async sendTestEmail() {
//     await this.emailSender.sendTestEmail('khanhvogpt2@gmail.com');
//     return {
//       message: 'Send test email successfully',
//     };
//   }
// }
