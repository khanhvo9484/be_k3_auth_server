import { HttpException, HttpExceptionOptions } from '@nestjs/common'
import {
	INFO_NOT_MATCH_CODE,
	DATABASE_EXECUTION_ERROR_CODE,
	EXCEL_PARSER_ERROR_CODE
} from './exception-statuscode-meaning'

export class InfoNotMatchException extends HttpException {
	constructor(message: string) {
		super(message, INFO_NOT_MATCH_CODE)
	}
}

export class DatabaseExecutionException extends HttpException {
	constructor(message: string, error?: string) {
		const options: ExceptionOptions = {
			message: message.toString(),
			error: (error && error.toString()) || '',
			statusCode: DATABASE_EXECUTION_ERROR_CODE
		}
		super(options, DATABASE_EXECUTION_ERROR_CODE)
	}
}

export class ExcelParserException extends HttpException {
	constructor(message: string, error?: string) {
		const options: ExceptionOptions = {
			message: message.toString(),
			error: (error && error.toString()) || '',
			statusCode: EXCEL_PARSER_ERROR_CODE
		}
		super(options, EXCEL_PARSER_ERROR_CODE)
	}
}
