import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('userStatistic')
export class UserStatisticEntity {
  @PrimaryColumn()
  userId: string;

  @Column()
  learnedWords: number;

  @Column('simple-json')
  optional: Record<string, unknown>;

  toResponse() {
    const { learnedWords, optional } = this;
    return { learnedWords, optional };
  }
}
