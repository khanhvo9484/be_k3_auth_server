import { UserResponse } from '@user/dto/user.dto'
import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class UserFullInfoReponse extends UserResponse {
	@Expose()
	isBlocked: boolean

	@Expose()
	isSuspended: boolean

	@Expose()
	accountType: string
}
