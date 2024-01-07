import * as mongoose from 'mongoose'
import { MONGODB_URL } from '../enviroment'

export const mongoProviders = [
	{
		provide: 'MONGO_CONNECTION',
		useFactory: (): Promise<typeof mongoose> => mongoose.connect(MONGODB_URL)
	}
]
