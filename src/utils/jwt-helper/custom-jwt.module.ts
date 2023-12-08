import { JwtModule } from '@nestjs/jwt'
import { DynamicModule, Module } from '@nestjs/common'
import { TokenFactoryService } from './token-factory.service'
import { IJwtModuleOptions } from './resources/token.interface'
@Module({})
export class CustomJWTModule {
	static register(options: IJwtModuleOptions): DynamicModule {
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
			exports: [TokenFactoryService],
			global: options.isGlobal || false
		}
	}
}
