import { generateId } from '@utils/id-helper'
import { Document, Schema } from 'mongoose'
import { NotificationType } from '../enum'

export interface IAction {
	_id: string
	actorId: string
	content: string
	type: string
	targetId: string
	isRead: boolean
	createAt: Date
}

const ActionSchema = new Schema(
	{
		_id: {
			type: String,
			required: true,
			unique: true,
			default: () => {
				return generateId('AC')
			}
		},
		actorId: {
			type: String,
			required: true
		},
		content: {
			type: String,
			required: true
		},
		type: {
			type: String,
			required: true
		},
		targetId: {
			type: String,
			required: true
		},
		isRead: {
			type: Boolean,
			required: true,
			default: false
		},
		createAt: {
			type: Date,
			default: Date.now()
		}
	},
	{
		timestamps: true
	}
)

ActionSchema.set('toObject', { getters: true }).set('toJSON', {
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

export { ActionSchema }
