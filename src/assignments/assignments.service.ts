import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { User } from '../users/user.entity';
import { Faq } from '../faq/faq.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Faq)
    private faqRepo: Repository<Faq>,
  ) {}

  async assignQuestion(userId: number, faqId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    const faq = await this.faqRepo.findOneBy({ id: faqId });

    if (!user || !faq) {
      throw new NotFoundException('User or FAQ not found');
    }

    const assignment = this.assignmentRepo.create({ user, faq });
    return this.assignmentRepo.save(assignment);
  }

  async markAsAnswered(assignmentId: number) {
    const assignment = await this.assignmentRepo.findOneBy({ id: assignmentId });
    if (!assignment) throw new NotFoundException('Assignment not found');

    assignment.answered = true;
    return this.assignmentRepo.save(assignment);
  }
}
