import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Assignment } from '../assignments/assignment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Anonymous' }) 
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  telegramId: number;

  @OneToMany(() => Assignment, (assignment) => assignment.user)
  assignments: Assignment[];
}
