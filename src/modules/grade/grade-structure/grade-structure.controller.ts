import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Req,
	Res
} from '@nestjs/common'
import { Request, Response } from 'express'
import { GradeStructureService } from './grade-structure.service'
import {
	CreateGradeStructureRequest,
	UpdateGradeStructureRequest
} from '../resource/dto/grade-structure'
import { Public } from '@common/decorator'

@Controller('grade-structure')
export class GradeStructureController {
	constructor(private gradeService: GradeStructureService) {}

	@Post('create')
	async createGradeStructure(
		@Req() request: Request,
		@Body() body: CreateGradeStructureRequest
	) {
		const user = request.user
		const result = await this.gradeService.createGradeStructure(body, user)
		return {
			message: ' create grade structure success',
			data: result
		}
	}

	@Public()
	@Put('update')
	async updateGradeStructure(
		@Req() request: Request,
		@Body() body: UpdateGradeStructureRequest
	) {
		const result = await this.gradeService.updateGradeStructure(body)
		return {
			message: 'update grade structure success',
			data: result
		}
	}

	@Public()
	@Get('get/:courseId')
	async getGradeStructure(
		@Req() request: Request,
		@Param() param: { courseId: string }
	) {
		const result = await this.gradeService.getGradeStructure(param.courseId)
		return {
			message: 'get grade structure success',
			data: result
		}
	}
}
