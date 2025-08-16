import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignQuestionDto } from './dto/assign-question.dto';
import { UpdateAssignmentStatusDto } from './dto/update-assignment-status.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly service: AssignmentsService) {}

  @Post()
  assign(@Body() dto: AssignQuestionDto) {
    return this.service.assign(dto);
  }

  @Get('user/:userId')
  forUser(@Param('userId') userId: string) {
    return this.service.findForUser(+userId);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateAssignmentStatusDto) {
    return this.service.updateStatus(+id, dto);
  }
}
