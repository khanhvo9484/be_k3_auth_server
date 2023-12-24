import { Connection } from 'mongoose'
import { GradeSubComponentSchema } from '../../shemas'

export const gradeSubComponentProvider = [
	{
		provide: 'GRADE_SUB_COMPONENT_MODEL',
		useFactory: (connection: Connection) =>
			connection.model('GradeSubComponent', GradeSubComponentSchema),
		inject: ['MONGO_CONNECTION']
	}
]
