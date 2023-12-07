export interface IToken {
	verify(token: string): Promise<Object>
	sign(payload: unknown): string
	decode(token: string): Promise<Object>
}
