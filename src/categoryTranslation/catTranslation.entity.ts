import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Language } from '../languages/language.entity';
import { Category } from 'src/category/category.entity';

@Entity()
@Unique(['categories', 'language'])
export class CatTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (c) => c.catTranslation, { onDelete: 'CASCADE' })
  categories: Category;

  @ManyToOne(() => Language, (l) => l.catTranslation, { eager: true, onDelete: 'CASCADE' })
  language: Language; // e.g., Amharic

  @Column()
  name: string;

}
