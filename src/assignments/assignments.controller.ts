import { Controller, Post, Patch, Param, Get } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './assignment.entity';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post(':userId/:faqId')
  assign(@Param('userId') userId: number, @Param('faqId') faqId: number): Promise<Assignment> {
    return this.assignmentsService.assignQuestion(userId, faqId);
  }

  @Patch(':id/answered')
  markAnswered(@Param('id') id: number): Promise<Assignment> {
    return this.assignmentsService.markAsAnswered(id);
  }

  @Get()
  findAll(): Promise<Assignment[]> {
    return this.assignmentsService.findAll();
  }
}
