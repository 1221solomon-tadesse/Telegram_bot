import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Question } from '../quations/question.entity';
import { CatTranslation } from 'src/categoryTranslation/catTranslation.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(() => Question, (question) => question.category)
  questions: Question[];
  @OneToMany(() => CatTranslation, (c) => c.categories, { cascade: true })
catTranslation: CatTranslation[];
}
