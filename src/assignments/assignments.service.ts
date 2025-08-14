import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { User } from '../users/user.entity';
import { FAQ } from '../faq/faq.entity';

@Injectable()
export class AssignmentsService {
 constructor(
  @InjectRepository(Assignment)
  private assignmentRepo: Repository<Assignment>,

  @InjectRepository(User)
  private userRepo: Repository<User>,

  @InjectRepository(FAQ)
  private faqRepo: Repository<FAQ>,
) {}
  async assignQuestion(userId: number, faqId: number): Promise<Assignment> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const faq = await this.faqRepo.findOne({ where: { id: faqId } });
    if (!faq) throw new NotFoundException('FAQ not found');

    const assignment = this.assignmentRepo.create({ user, faq });
    return this.assignmentRepo.save(assignment);
  }

  async markAsAnswered(assignmentId: number): Promise<Assignment> {
    const assignment = await this.assignmentRepo.findOne({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    assignment.answered = true;
    return this.assignmentRepo.save(assignment);
  }

  async findAll(): Promise<Assignment[]> {
    return this.assignmentRepo.find();
  }
}
