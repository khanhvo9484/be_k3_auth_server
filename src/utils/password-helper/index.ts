import * as bcrypt from 'bcrypt'
export async function createHashPassword(password: string): Promise<string> {
	const salt = await bcrypt.genSalt()
	const hashPassword = await bcrypt.hash(password, salt)
	return hashPassword
}
export async function comparePassword(
	password: string,
	hashPassword: string
): Promise<boolean> {
	const result = await bcrypt.compare(password, hashPassword)
	return result
}
