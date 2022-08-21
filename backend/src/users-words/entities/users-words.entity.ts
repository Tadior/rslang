import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('userWords')
export class UserWordsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  wordId: string;

  @Column()
  userId: string;

  @Column()
  difficulty: string;

  @Column('simple-json')
  optional: Record<string, unknown>;

  toResponse() {
    const { id, wordId, difficulty } = this;
    return { id, wordId, difficulty };
  }
}
