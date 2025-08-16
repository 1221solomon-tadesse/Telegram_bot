import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { Assignment } from './assignment.entity';
import { User } from '../users/user.entity';
import { Question } from '../quations/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, User, Question])],
  providers: [AssignmentsService],
  controllers: [AssignmentsController],
})
export class AssignmentsModule {}
