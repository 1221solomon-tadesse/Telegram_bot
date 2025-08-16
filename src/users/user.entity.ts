import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn,
} from 'typeorm';
import { Question } from '../quations/question.entity';
import { Assignment } from '../assignments/assignment.entity';

export type UserRole = 'admin' | 'agent' | 'user';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Anonymous' })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: ['admin', 'agent', 'user'], default: 'user' })
  role: UserRole;

  @Column({ type: 'bigint', nullable: true })
  telegramId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Question, (q) => q.createdBy)
  questionsCreated: Question[];

  @OneToMany(() => Assignment, (a) => a.user)
  assignments: Assignment[];
}
