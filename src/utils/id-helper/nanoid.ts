import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet(
	'1234567890abcdefghijklmnopqrstuvwxyzQWERTYUIOPASFGHJKLZXCVBNM',
	8
)

const nanoid2 = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6)
export function generateId(prefix: string, length?: number) {
	if (length) {
		return `${prefix}${nanoid()}`
	}
	return `${prefix}${nanoid()}`
}

export function generateCode(length?: number) {
	if (length) {
		return nanoid2()
	}
	return nanoid2()
}
