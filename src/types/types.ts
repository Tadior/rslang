export interface Word {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}
export interface User {
  name: string;
  email: string;
  password: string;
}
export interface UpdateUser {
  email: string;
  password: string;
}
export interface UserWord {
  difficulty: string;
  id: string;
  wordId: string;
}
export interface UserStatistics {
  learnedWords: number;
  optional?: {};
}
export interface Settings {
  userId: string,
  wordsPerDay: number,
  optional?: {}
}
