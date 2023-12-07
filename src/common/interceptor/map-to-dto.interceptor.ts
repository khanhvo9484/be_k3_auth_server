// generic-response.interceptor.ts
import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToClass } from 'class-transformer'

@Injectable()
export class GenericResponseInterceptor<T> implements NestInterceptor<T, any> {
	constructor(private readonly dto: new (...args: any[]) => T) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next
			.handle()
			.pipe(
				map((data) =>
					plainToClass(this.dto, data, { excludeExtraneousValues: true })
				)
			)
	}
}
