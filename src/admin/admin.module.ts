import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { AdminRepository } from './admin.repository'
@Module({
	imports: [],
	providers: [AdminService, AdminRepository],
	controllers: [AdminController]
})
export class AdminModule {}
