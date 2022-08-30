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
  optional?: {
    [key: string] : UserDayStatistic
  };
}
export interface Settings {
  userId: string;
  wordsPerDay: number;
  optional?: {};
}
export interface SignInResponse {
  message: string;
  token: string;
  refreshToken?: string;
  userId: string;
  name: string;
}

export interface UserLearnedWords {
  userId: string,
  learnedWords: string[]
}

export interface UserLearnedWordsCheck {
  userLearnedWordsExists: boolean
}

export interface UserDayStatistic {
  sprintRow: number,
  sprintAccuracy: number,
  audioRow: number,
  audioAccuracy: number,
  learnedWords: number
}
