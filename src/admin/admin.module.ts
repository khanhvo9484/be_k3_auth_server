import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { AdminRepository } from './admin.repository'
import { AuthModule } from 'auth/auth.module'

@Module({
	imports: [AuthModule],
	providers: [AdminService, AdminRepository],
	controllers: [AdminController]
})
export class AdminModule {}
