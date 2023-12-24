import { Connection } from 'mongoose'
import { GradeComponentSchema } from '../../shemas'

export const gradeComponentProvider = [
	{
		provide: 'GRADE_COMPONENT_MODEL',
		useFactory: (connection: Connection) =>
			connection.model('GradeComponent', GradeComponentSchema),
		inject: ['MONGO_CONNECTION']
	}
]
