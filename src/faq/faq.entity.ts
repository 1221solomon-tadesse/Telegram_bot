import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Assignment } from '../assignments/assignment.entity';

@Entity()
export class FAQ {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column({ nullable: true })
  answer: string;

  // Add this new field
  @Column({ default: 'text' })
  type: 'text' | 'video';

  @OneToMany(() => Assignment, (assignment) => assignment.faq)
  assignments: Assignment[];
}
