import { Connection } from 'mongoose'
import { StudentGradeSchema } from '../../shemas'

export const studentGradeProvider = [
	{
		provide: 'STUDENT_GRADE_MODEL',
		useFactory: (connection: Connection) =>
			connection.model('StudentGrade', StudentGradeSchema),
		inject: ['MONGO_CONNECTION']
	}
]
