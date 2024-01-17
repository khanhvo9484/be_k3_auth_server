import { Injectable } from '@nestjs/common'
import {
	IToken,
	InviteToCourseJwtPayload,
	ResetJwtPasswordPayload
} from './token.interface'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class InviteToCourseToken implements IToken {
	private privateKey: string | Buffer
	private publicKey: string | Buffer
	private expiresIn: number
	constructor(private jwtService: JwtService) {}
	setKeys(privateKey: string | Buffer, publicKey: string | Buffer): void {
		this.privateKey = privateKey
		this.publicKey = publicKey
	}
	setExpiresIn(expiresIn: number): void {
		this.expiresIn = expiresIn
	}
	setJwtService(jwtService: any): void {
		this.jwtService = jwtService
	}
	async verify<T>(token: string) {
		try {
			const result = await this.jwtService.verify(token, {
				secret: this.publicKey,
				algorithms: ['RS256']
			})
			return result
		} catch (error) {
			return null
		}
	}
	sign(
		payload:
			| CustomJwtPayload
			| ResetJwtPasswordPayload
			| InviteToCourseJwtPayload
	): string {
		if (!payload) {
			return null
		}
		try {
			return this.jwtService.sign(payload, {
				secret: this.privateKey,
				algorithm: 'RS256',
				expiresIn: this.expiresIn || 3600
			})
		} catch (error) {
			console.log(error)
			throw new Error(error.message)
		}
	}
	async decode<T>(token: string): Promise<T> {
		try {
			return await this.jwtService.decode(token, {
				json: true,
				complete: true
			})
		} catch (error) {
			return null
		}
	}
}
