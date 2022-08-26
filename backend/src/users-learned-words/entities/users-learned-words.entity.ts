import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('usersLearnedWords')
export class UsersLearnedWordsEntity {
  @PrimaryColumn()
  userId: string;

  @Column('simple-array')
  learnedWords: string[];

  toResponse() {
    const { userId, learnedWords } = this;
    return { userId, learnedWords };
  }
}
