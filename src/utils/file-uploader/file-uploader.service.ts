import { Injectable } from '@nestjs/common'
import { storage } from './resource/config'
import { getDownloadURL, ref as refs, uploadBytes } from 'firebase/storage'
import { nanoid } from 'nanoid'
import { fileTypeFromFile } from 'file-type'
@Injectable()
export class FileUploaderService {
	constructor() {}

	async uploadFile(file: any) {
		console.log(file)
		const storageRef = refs(storage, nanoid() + file.name)
		const snapshot = await uploadBytes(storageRef, file.buffer)
		const downloadURL = await getDownloadURL(snapshot.ref)
		return downloadURL
	}
}
