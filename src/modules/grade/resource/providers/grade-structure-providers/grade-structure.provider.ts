import { Connection } from 'mongoose'
import { GradeStructureSchema } from '../../shemas'

export const gradeStructureProvider = [
	{
		provide: 'GRADE_STRUCTURE_MODEL',
		useFactory: (connection: Connection) =>
			connection.model('GradeStructure', GradeStructureSchema),
		inject: ['MONGO_CONNECTION']
	}
]
