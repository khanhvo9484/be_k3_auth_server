import { Connection } from 'mongoose'
import { GradeReviewSchema } from '../../shemas'

export const gradeReviewProvider = [
	{
		provide: 'GRADE_REVIEW_MODEL',
		useFactory: (connection: Connection) =>
			connection.model('GradeReview', GradeReviewSchema),
		inject: ['MONGO_CONNECTION']
	}
]