import { Injectable } from '@nestjs/common'
import { storage } from './resource/config'
import { getDownloadURL, ref as refs, uploadBytes } from 'firebase/storage'
import { nanoid } from 'nanoid'
@Injectable()
export class FileUploaderService {
	constructor() {}

	async uploadFile(file: any) {
		const storageRef = refs(storage, nanoid())
		const snapshot = await uploadBytes(storageRef, file.buffer)
		const downloadURL = await getDownloadURL(snapshot.ref)
		return downloadURL
	}
}
