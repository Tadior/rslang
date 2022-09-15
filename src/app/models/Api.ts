import {
  Word,
  User,
  UpdateUser,
  UserWord,
  UserStatistics,
  Settings,
  UserLearnedWords,
  UserLearnedWordsCheck,
  SignInResponse,
  SignUpResponse,
} from '../../types/types';
import url from './variables';

export default class Api {
  baseUrl: string;

  constructor() {
    this.baseUrl = url;
  }

  public async getWords(group: string, page: string): Promise<Word[]> {
    const request = await fetch(`${this.baseUrl}words?group=${group}&page=${page}`);
    return request.json();
  }

  public async getWordById(wordId: string): Promise<Word> {
    const request = await fetch(`${this.baseUrl}words/${wordId}`);
    return request.json();
  }

  public async createUser(bodyObj: User): Promise<SignUpResponse> {
    const request = await fetch(`${this.baseUrl}users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(bodyObj),
    });
    return request.json();
  }

  public async getUserById(userId: string): Promise<User> {
    const request = await fetch(`${this.baseUrl}users/${userId}`);
    return request.json();
  }

  public async updateUserById(userId: string, bodyObj: UpdateUser): Promise<void> {
    const request = await fetch(`${this.baseUrl}users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(bodyObj),
    });
    return request.json();
  }

  public async getUserWords(userId: string): Promise<UserWord[]> {
    const request = await fetch(`${this.baseUrl}users/${userId}/words`);
    return request.json();
  }

  public async createUserWord(bodyObj: UserWord): Promise<UserWord> {
    const request = await fetch(`${this.baseUrl}users/${bodyObj.id}/words/${bodyObj.wordId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(bodyObj),
    });
    return request.json();
  }

  public async getUserWordById(userId: string, wordId: string): Promise<UserWord> {
    const request = await fetch(`${this.baseUrl}users/${userId}/words/${wordId}`);
    return request.json();
  }

  public async updateUserWordById(bodyObj: UserWord): Promise<UserWord> {
    const request = await fetch(`${this.baseUrl}users/${bodyObj.id}/words/${bodyObj.wordId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(bodyObj),
    });
    return request.json();
  }

  public async deleteUserWordById(userId: string, wordId: string) {
    try {
      await fetch(`${this.baseUrl}users/${userId}/words/${wordId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      });
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async getUserStatisticsById(userId: string): Promise<UserStatistics[]> {
    const request = await fetch(`${this.baseUrl}users/${userId}/statistics`);
    return request.json();
  }

  public async updateUserStatisticsById(
    userId: string,
    bodyObj: UserStatistics,
  ): Promise<UserStatistics[]> {
    const request = await fetch(`${this.baseUrl}users/${userId}/statistics`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(bodyObj),
    });
    return request.json();
  }

  public async getSettingsById(userId: string): Promise<Settings[]> {
    const request = await fetch(`${this.baseUrl}users/${userId}/settings`);
    return request.json();
  }

  public async updateSettingsById(bodyObj: Settings): Promise<Settings> {
    const request = await fetch(`${this.baseUrl}users/${bodyObj.userId}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(bodyObj),
    });
    return request.json();
  }

  public async getAllLearnedWords(userId: string): Promise<UserLearnedWords> {
    const request = await fetch(`${this.baseUrl}users/${userId}/learnedWords`);
    return request.json();
  }

  public async isWordLearned(userId: string, wordId: string): Promise<UserLearnedWordsCheck> {
    const request = await fetch(`${this.baseUrl}users/${userId}/learnedWords/${wordId}`);
    return request.json();
  }

  public async updateUserLearnedWords(userId: string, wordId: string): Promise<UserLearnedWords> {
    const request = await fetch(`${this.baseUrl}users/${userId}/learnedWords/${wordId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    return request.json();
  }

  public async deleteUserLearnedWordById(userId: string, wordId: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}users/${userId}/learnedWords/${wordId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      });
    } catch (e: any) {
      throw new Error(e);
    }
  }

  public async signIn(bodyObj: User): Promise<SignInResponse> {
    const request = await fetch(`${this.baseUrl}signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(bodyObj),
    });
    return request.json();
  }
}
