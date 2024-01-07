import { generateId } from '@utils/id-helper'
import { Schema, Document } from 'mongoose'
import { IAction } from './action.schema'
import { ActionSchema } from './action.schema'
export interface INotification extends Document {
	_id: string
	userId: string
	actions: IAction[]
}

const NotificationSchema = new Schema(
	{
		_id: {
			type: String,
			required: true,
			unique: true,
			default: () => {
				return generateId('NT')
			}
		},
		userId: {
			type: String,
			required: true
		},
		actions: [ActionSchema]
	},
	{
		timestamps: true,
		_id: true
	}
)

NotificationSchema.set('toObject', { getters: true }).set('toJSON', {
	getters: true,
	minimize: false,
	transform: function (doc, ret, options) {
		// Create a new object to control property order
		const transformedObject: Record<string, any> = {}

		// Add 'id' property at the start
		transformedObject.id = ret._id

		// Copy other properties to the new object
		for (const key in ret) {
			if (key !== '_id' && key !== '__v') {
				transformedObject[key] = ret[key]
			}
		}

		return transformedObject
	}
})
export { NotificationSchema }
