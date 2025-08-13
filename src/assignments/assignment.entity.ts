// src/assignments/assignment.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from '../users/user.entity';
import { Faq } from '../faq/faq.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Faq, { eager: true })
  @JoinColumn({ name: 'faqId' })
  faq: Faq;

  @Column({ default: false })
  answered: boolean;
}
