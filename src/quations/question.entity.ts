import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Language } from '../languages/language.entity';
import { User } from '../users/user.entity';
import { Translation } from '../translations/translation.entity';
import { Assignment } from '../assignments/assignment.entity';
import { Category } from '../category/category.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()           
  title: string;

  @Column('text')    
  content: string;
 @ManyToOne(() => Category, (category) => category.questions, { eager: true })
  category: Category;
  @ManyToOne(() => Language, (lang) => lang.questions, { eager: true })
  language: Language;

  @ManyToOne(() => User, (u) => u.questionsCreated, { eager: true, nullable: true })
  createdBy: User | null;

  @OneToMany(() => Translation, (t) => t.question, { cascade: true })
  translations: Translation[];

  @OneToMany(() => Assignment, (a) => a.question)
  assignments: Assignment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
