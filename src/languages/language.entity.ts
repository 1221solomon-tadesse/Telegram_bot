import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { Question } from '../quations/question.entity';
import { Translation } from '../translations/translation.entity';

@Entity()
@Unique(['code'])
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() // e.g., "English"
  name: string;

  @Column() // e.g., "en", "am"
  code: string;

  @OneToMany(() => Question, (q) => q.language)
  questions: Question[];

  @OneToMany(() => Translation, (t) => t.language)
  translations: Translation[];
}
