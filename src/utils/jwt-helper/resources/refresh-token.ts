import { Injectable } from '@nestjs/common'
import { IToken } from './token.interface'
import { JwtService } from '@nestjs/jwt'
import * as fs from 'fs'

export class RefreshToken implements IToken {
	private privateKey: string | Buffer
	private publicKey: string | Buffer
	constructor(private jwtService: JwtService) {
		this.privateKey = fs.readFileSync('./jwt-key/refresh.token.privatekey.pem')
		this.publicKey = fs.readFileSync('./jwt-key/refresh.token.publickey.pem')
	}
	async verify(token: string): Promise<Object | CustomJwtPayload> {
		try {
			const result: CustomJwtPayload = await this.jwtService.verify(token, {
				secret: this.publicKey,
				algorithms: ['RS256']
			})
			return result
		} catch (error) {
			return null
		}
	}
	sign(payload: unknown): string {
		if (!payload) {
			return null
		}

		if ((payload as CustomJwtPayload).id !== undefined) {
			return this.jwtService.sign(payload as CustomJwtPayload, {
				secret: this.privateKey,
				algorithm: 'RS256'
			})
		} else {
			throw new Error('Invalid payload type')
		}
	}
	async decode(token: string): Promise<Object | CustomJwtPayload> {
		try {
			return (await this.jwtService.decode(token, {
				json: true,
				complete: true
			})) as CustomJwtPayload
		} catch (error) {
			return null
		}
	}
}
