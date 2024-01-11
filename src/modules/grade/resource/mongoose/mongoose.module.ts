import { Module } from '@nestjs/common'
import { mongoProviders } from './mongoose.provider'
import { gradeStructureProvider, studentGradeProvider } from '../providers'
@Module({
	providers: [
		...mongoProviders,
		...gradeStructureProvider,
		...studentGradeProvider
	],
	exports: [
		...mongoProviders,
		...gradeStructureProvider,
		...studentGradeProvider
	]
})
export class MongooseDatabaseModule {}
