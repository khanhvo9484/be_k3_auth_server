import { ExcelParserException } from '@common/exceptions'
import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import * as XLSX from 'xlsx'

@Injectable()
export class ExcelService {
	constructor() {}

	async generateExcelFile(data: any[], sheetName: string, fileName: string) {
		try {
			const workBook = XLSX.utils.book_new()
			const workSheet = XLSX.utils.json_to_sheet(data)
			XLSX.utils.book_append_sheet(workBook, workSheet, sheetName)
			XLSX.writeFile(workBook, fileName)
		} catch (err) {
			throw new ExcelParserException(err.message)
		}
	}

	async generateExcelBuffer(
		columns: any[],
		sheetName: string
	): Promise<Buffer> {
		const workBook = XLSX.utils.book_new()
		const workSheet = XLSX.utils.aoa_to_sheet([columns])

		XLSX.utils.book_append_sheet(workBook, workSheet, sheetName)

		return XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' })
	}

	async generateExcelBufferWithData(data: any[], sheetName: string) {
		const workBook = XLSX.utils.book_new()
		const workSheet = XLSX.utils.json_to_sheet(data)

		XLSX.utils.book_append_sheet(workBook, workSheet, sheetName)

		return XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' })
	}

	async generateExcelBufferWithComplexData() {
		throw new Error('Not implemented')
	}
	async readExcelFile<T>(file: any) {
		try {
			if (!file || !file.buffer || !(file.buffer instanceof Buffer)) {
				throw new Error('Invalid Excel file')
			}
			const workBook = XLSX.read(file.buffer, { type: 'buffer' })
			const workSheet = workBook.Sheets[workBook.SheetNames[0]]
			const data = XLSX.utils.sheet_to_json(workSheet)
			return data
		} catch (err) {
			throw new ExcelParserException(err.message)
		}
	}
}
