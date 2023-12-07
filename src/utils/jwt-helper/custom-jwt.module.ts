import { JwtModule } from '@nestjs/jwt'
import { DynamicModule, Module } from '@nestjs/common'
import { TokenFactoryService } from './token-factory.service'
@Module({})
export class CustomJWTModule {
	static register(options: Record<string, any>): DynamicModule {
		return {
			module: CustomJWTModule,
			imports: [JwtModule.register({})],
			providers: [
				{
					provide: 'JWT_OPTIONS',
					useValue: options
				},
				TokenFactoryService
			],
			exports: [TokenFactoryService]
		}
	}
}
