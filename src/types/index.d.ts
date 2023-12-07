type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
	? A
	: never

interface ExceptionOptions {
	message: string
	error: string
	statusCode: number
}

// JWT Payload
type CustomJwtPayload = {
	id: number
	email: string
	name: string
	role: string
}
