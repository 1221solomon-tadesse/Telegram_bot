import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { Question } from '../quations/question.entity';
import { Translation } from '../translations/translation.entity';
import { Category } from 'src/category/category.entity';
import { CatTranslation } from 'src/categoryTranslation/catTranslation.entity';

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
@OneToMany(()=>CatTranslation,(ct)=>ct.language)
catTranslation:CatTranslation[];

}
