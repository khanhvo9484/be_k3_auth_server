type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any
	? A
	: never

interface ExceptionOptions {
	message: string
	error: string
	statusCode: number
}

// JWT Payload
class CustomJwtPayload {
	id: string
	email: string
	name: string
	role: string
}

type Record<string, any> = {
	[key: string]: any
}
