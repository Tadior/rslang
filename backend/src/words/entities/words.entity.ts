import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('word')
export class WordsEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  group: number;

  @Column()
  page: number;

  @Column()
  word: string;

  @Column()
  image: string;

  @Column()
  audio: string;

  @Column()
  audioMeaning: string;

  @Column()
  audioExample: string;

  @Column()
  textMeaning: string;

  @Column()
  textExample: string;

  @Column()
  transcription: string;

  @Column()
  __v: number;

  @Column()
  wordTranslate: string;

  @Column()
  textMeaningTranslate: string;

  @Column()
  textExampleTranslate: string;

  toResponse() {
    const {
      id,
      group,
      page,
      word,
      image,
      audio,
      audioMeaning,
      audioExample,
      textMeaning,
      textExample,
      transcription,
      wordTranslate,
      textMeaningTranslate,
      textExampleTranslate,
    } = this;
    return {
      id,
      group,
      page,
      word,
      image,
      audio,
      audioMeaning,
      audioExample,
      textMeaning,
      textExample,
      transcription,
      wordTranslate,
      textMeaningTranslate,
      textExampleTranslate,
    };
  }
}
