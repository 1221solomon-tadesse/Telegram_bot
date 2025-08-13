import { Controller, Post, Param, Patch } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @Post(':userId/:faqId')
  assign(@Param('userId') userId: number, @Param('faqId') faqId: number) {
    return this.assignmentsService.assignQuestion(userId, faqId);
  }

  @Patch(':id/answered')
  markAnswered(@Param('id') id: number) {
    return this.assignmentsService.markAsAnswered(id);
  }
}
