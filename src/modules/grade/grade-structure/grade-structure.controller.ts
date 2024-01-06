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
	CreateGradeSubcomponent,
	UpdateGradeStructureRequest,
	UpdateGradeStructureRequestRewrite,
	UpdateGradeSubComponentRequest
} from './resource/dto'
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
		@Body() body: { gradeComponent: UpdateGradeStructureRequest[] }
	) {
		const result = await this.gradeService.updateGradeStructure(
			body.gradeComponent
		)
		return {
			message: 'update grade structure success',
			data: result
		}
	}

	@Public()
	@Post('create-grade-subcomponent')
	async createGradeSubcomponent(
		@Req() request: Request,
		@Body() body: { subComponent: CreateGradeSubcomponent[] }
	) {
		const subComponent = body.subComponent
		const result = await this.gradeService.createGradeSubcomponent(subComponent)
		return {
			message: 'create grade subcomponent success',
			data: result
		}
	}

	@Public()
	@Put('update-grade-rewrite')
	async updateGradeRewrite(
		@Req() request: Request,
		@Body()
		body: {
			gradeComponent: UpdateGradeStructureRequestRewrite[]
			courseId: string
		}
	) {
		const result = await this.gradeService.updateGradeRewrite(
			body.gradeComponent,
			body.courseId
		)
		return {
			message: 'update grade structure success',
			data: result
		}
	}

	@Public()
	@Put('update-grade-subcomponent')
	async updateGradeSubComponent(
		@Req() request: Request,
		@Body() body: { subComponent: UpdateGradeSubComponentRequest[] }
	) {
		const subComponent = body.subComponent
		const result = await this.gradeService.updateGradeSubComponent(subComponent)
		return {
			message: 'update grade subcomponent success',
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
