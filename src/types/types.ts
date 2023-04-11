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
  userId?: string;
  name?: string;
  email?: string;
  password?: string;
  message?: string[];
  token?: string;
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
    [key: string]: UserDayStatistic;
  };
}
export interface Settings {
  userId: string;
  wordsPerDay: number;
  optional?: {};
}
export interface SignInResponse {
  message: string[];
  token: string;
  refreshToken?: string;
  userId: string;
  name: string;
  error?: string;
  statusCode?: string;
}

export interface SignUpResponse {
  message?: string[];
  error?: string;
  statusCode?: string;
}

export interface UserLearnedWords {
  userId: string;
  learnedWords: string[];
}

export interface UserLearnedWordsCheck {
  userLearnedWordsExists: boolean;
}

export interface UserDayStatistic {
  sprintRow?: number;
  sprintAccuracy?: number;
  sprintNewWords?: number;
  audioRow?: number;
  audioAccuracy?: number;
  audioNewWords?: number;
  learnedWords?: number;
}

export type TQuestionsAnswers = {
  [key: string]: string;
};

export type StatisicProperty = 'sprintRow' | 'sprintAccuracy' | 'sprintNewWords' | 'audioRow' | 'audioAccuracy' | 'audioNewWords';

export type Progress = {
  [key: string]: boolean[];
};

export interface ICheckAnswer {
  isCorrectAnswer: boolean;
  russian: string;
  english: string;
}
