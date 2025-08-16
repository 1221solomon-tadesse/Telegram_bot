import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { User } from '../users/user.entity';
import { Question } from '../quations/question.entity';
import { AssignQuestionDto } from './dto/assign-question.dto';
import { UpdateAssignmentStatusDto } from './dto/update-assignment-status.dto';
@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment) private repo: Repository<Assignment>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Question) private qRepo: Repository<Question>,
  ) {}

  async assign(dto: AssignQuestionDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const question = await this.qRepo.findOne({ where: { id: dto.questionId } });
    if (!question) throw new NotFoundException('Question not found');

    const a = this.repo.create({ user, question, status: 'pending' });
    return this.repo.save(a);
  }

  findForUser(userId: number) {
    return this.repo.find({ where: { user: { id: userId } } });
  }

  async updateStatus(id: number, dto: UpdateAssignmentStatusDto) {
    const a = await this.repo.findOne({ where: { id } });
    if (!a) throw new NotFoundException('Assignment not found');

    a.status = dto.status;
    a.answeredAt = dto.status === 'answered' ? new Date() : null;
    return this.repo.save(a);
  }
}
