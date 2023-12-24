import { Module } from '@nestjs/common'
import { mongoProviders } from './mongoose.provider'
import {
	gradeStructureProvider,
	gradeComponentProvider,
	studentGradeProvider,
	gradeSubComponentProvider,
	gradeReviewProvider,
	gradeReviewCommentProvider
} from '../providers'
@Module({
	providers: [
		...mongoProviders,
		...gradeStructureProvider,
		// ...gradeComponentProvider,
		...studentGradeProvider,
		// ...gradeSubComponentProvider
		...gradeReviewProvider,
		...gradeReviewCommentProvider
	],
	exports: [
		...mongoProviders,
		...gradeStructureProvider,
		// ...gradeComponentProvider,
		...studentGradeProvider,
		// ...gradeSubComponentProvider
		...gradeReviewProvider,
		...gradeReviewCommentProvider
	]
})
export class MongooseDatabaseModule {}
