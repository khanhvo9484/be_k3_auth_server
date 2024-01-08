import { Global, Module } from '@nestjs/common'
import { MyGatewayService } from './gateway'

@Global()
@Module({
	imports: [],
	providers: [MyGatewayService],
	exports: [MyGatewayService]
})
export class GatewayModule {}
