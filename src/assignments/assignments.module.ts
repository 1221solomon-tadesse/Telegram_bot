import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { Assignment } from './assignment.entity';
import { User } from '../users/user.entity';
import { Faq } from '../faq/faq.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, User, Faq])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule {}
