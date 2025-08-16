import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Question } from '../quations/question.entity';
import { Language } from '../languages/language.entity';

@Entity()
@Unique(['question', 'language'])
export class Translation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, (q) => q.translations, { onDelete: 'CASCADE' })
  question: Question;

  @ManyToOne(() => Language, (l) => l.translations, { eager: true, onDelete: 'CASCADE' })
  language: Language; // e.g., Amharic

  @Column()
  title: string;

  @Column('text')
  content: string;
}
