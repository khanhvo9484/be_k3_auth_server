export interface IToken {
	verify<T>(token: string): Promise<T>
	sign(payload: unknown): string
	decode<T>(token: string): Promise<T>
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
