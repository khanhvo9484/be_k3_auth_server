import { Global, Module } from '@nestjs/common'
import { FileUploaderService } from './file-uploader.service'

@Global()
@Module({
	imports: [],
	providers: [FileUploaderService],
	exports: [FileUploaderService]
})
export class FileUploaderModule {}
