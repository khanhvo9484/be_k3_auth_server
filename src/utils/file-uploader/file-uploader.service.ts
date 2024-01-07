import { Injectable } from '@nestjs/common'
import { storage } from './resource/config'
import {
	getDownloadURL,
	ref as refs,
	updateMetadata,
	uploadBytes
} from 'firebase/storage'
import { nanoid } from 'nanoid'

@Injectable()
export class FileUploaderService {
	constructor() {}

	async uploadFile(file: any) {
		try {
			const storageRef = refs(storage, nanoid() + file.originalname)
			const snapshot = await uploadBytes(storageRef, file.buffer)

			// Set metadata to allow for browser preview
			await updateMetadata(storageRef, {
				contentType: file.mimetype // Set the content type based on the file mimetype
			})
			const downloadURL = await getDownloadURL(snapshot.ref)
			return downloadURL
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}
