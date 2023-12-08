import { Module } from '@nestjs/common'
import { UsersModule } from '@user/user.module'

@Module({
	imports: [UsersModule],
	controllers: [],
	providers: []
})
export class CourseModule {}
