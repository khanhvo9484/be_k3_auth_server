export interface IToken {
	verify(token: string): Promise<Object>
	sign(payload: unknown): string
	decode(token: string): Promise<Object>
	setKeys(privateKey: string | Buffer, publicKey: string | Buffer): void
	setJwtService(jwtService: any): void
	setExpiresIn(expiresIn: number): void
}

export interface IJwtModuleOptions {
	accessTokenPrivateKey: string | Buffer
	accessTokenPublicKey: string | Buffer
	refreshTokenPrivateKey: string | Buffer
	refreshTokenPublicKey: string | Buffer

	othersTokenPrivateKey?: string | Buffer
	othersTokenPublicKey?: string | Buffer

	accessTokenExpiresIn?: number
	refreshTokenExpiresIn?: number
	otherTokenExpiresIn?: number

	isGlobal?: boolean
}
