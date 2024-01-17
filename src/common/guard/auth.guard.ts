import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { Request } from 'express'
import { IS_PUBLIC_KEY } from '@common/decorator/public-route.decorator'
import { Reflector } from '@nestjs/core'
import { TokenFactoryService } from '@utils/jwt-helper/token-factory.service'
import { TokenType } from '@utils/jwt-helper/resources/token-type.enum'
import { AuthService } from 'auth/auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private tokenFactoryService: TokenFactoryService,
		private authService: AuthService,
		private reflector: Reflector
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass()
		])
		if (isPublic) {
			// 💡 See this condition
			return true
		}
		const request = context.switchToHttp().getRequest()
		const token = this.extractTokenFromHeader(request)
		if (!token) {
			throw new UnauthorizedException('Token not found')
		}

		const payload = await this.tokenFactoryService.verify<CustomJwtPayload>(
			token,
			TokenType.ACCESS_TOKEN
		)

		if (!payload) {
			throw new UnauthorizedException('Token not found')
		}
		const isValidate = await this.authService.validateUser(payload.email)
		if (!isValidate) {
			throw new UnauthorizedException('Token is not valid')
		}

		request.user = payload

		return true
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? []
		return type === 'Bearer' ? token : undefined
	}
}
