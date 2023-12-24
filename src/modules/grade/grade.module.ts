import { Module } from '@nestjs/common'
import { GradeStructureModule } from './grade-structure/grade-structure.module'
@Module({
	imports: [GradeStructureModule],
	providers: [],
	controllers: []
})
export class GradeModule {}
