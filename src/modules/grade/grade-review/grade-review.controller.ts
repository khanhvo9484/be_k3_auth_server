import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileUploaderService } from '@utils/file-uploader/file-uploader.service'
import { FileInterceptor } from '@nestjs/platform-express/multer'
@Controller('grade-review')
export class GradeReviewController {
	constructor(private fileUploaderService: FileUploaderService) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: any) {
		try {
			const result = await this.fileUploaderService.uploadFile(file)
			return {
				message: 'upload file success',
				data: result
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}
