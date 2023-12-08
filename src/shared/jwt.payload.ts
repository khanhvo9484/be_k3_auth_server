export class JwtPayloadDto {
	private sub: string = 'K3 Learning'
	private iss: string = ''
	private aud: string = ''
	private id: string
	private email: string
	private name: string
	private role: string
	constructor(params: CustomJwtPayload) {
		const { id, email, name, role } = params
		this.id = id
		this.email = email
		this.name = name
		this.role = role
	}
}
