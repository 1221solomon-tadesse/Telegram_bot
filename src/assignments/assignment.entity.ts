import {
  Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Question } from '../quations/question.entity';

export type AssignmentStatus = 'pending' | 'answered' | 'rejected';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.assignments, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Question, (q) => q.assignments, { eager: true, onDelete: 'CASCADE' })
  question: Question;

  @CreateDateColumn()
  assignedAt: Date;

  @Column({ type: 'enum', enum: ['pending', 'answered', 'rejected'], default: 'pending' })
  status: AssignmentStatus;

  @Column({ type: 'timestamp', nullable: true })
  answeredAt: Date | null;
}
