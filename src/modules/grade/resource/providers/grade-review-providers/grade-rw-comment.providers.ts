import { Connection } from 'mongoose'
import { GradeReviewCommentSchema } from '../../shemas'

export const gradeReviewCommentProvider = [
	{
		provide: 'GRADE_REVIEW_COMMENT_MODEL',
		useFactory: (connection: Connection) =>
			connection.model('GradeComponent', GradeReviewCommentSchema),
		inject: ['MONGO_CONNECTION']
	}
]
