import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../users/user.entity';
import { FAQ } from '../faq/faq.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.assignments, { eager: true })
  user: User;

  @ManyToOne(() => FAQ, (faq) => faq.assignments, { eager: true })
  faq: FAQ;

  @Column({ default: false })
  answered: boolean;
}
