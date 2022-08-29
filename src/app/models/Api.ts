import {
  Word,
  User,
  UpdateUser,
  UserWord,
  UserStatistics,
  Settings,
  SignInResponse,
  CheckLearnedWord,
  AllUserLearnedWords,
} from '../../types/types';
import url from './variables';

export default class Api {
  baseUrl: string;

  constructor() {
    this.baseUrl = url;
  }

  async getWords(group: string, page: string): Promise<Word[]> {
    const request = await fetch(`${this.baseUrl}words?group=${group}&page=${page}`);
    return request.json();
  }

  async getWordsById(wordId: string): Promise<Word[]> {
    const request = await fetch(`${this.baseUrl}words?id=${wordId}`);
    return request.json();
  }

  async createUser(bodyObj: User): Promise<User> {
    const request = await fetch(`${this.baseUrl}users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(bodyObj),
    });
    return request.json();
  }

  async getUserById(userId: string): Promise<User> {
    const request = await fetch(`${this.baseUrl}users/${userId}`);
    return request.json();
  }

  async updateUserById(userId: string, bodyObj: UpdateUser): Promise<void> {
    const request = await fetch(`${this.baseUrl}users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(bodyObj),
    });
    return request.json();
  }

  async getUserWords(userId: string): Promise<UserWord[]> {
    const request = await fetch(`${this.baseUrl}users/${userId}/words`);
    return request.json();
  }

  async createUserWord(bodyObj: UserWord): Promise<UserWord> {
    const request = await fetch(`${this.baseUrl}users/${bodyObj.id}/words/${bodyObj.wordId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(bodyObj),
    });
    return request.json();
  }

  async getUserWordById(userId: string, wordId: string): Promise<UserWord> {
    const request = await fetch(`${this.baseUrl}users/${userId}/words/${wordId}`);
    return request.json();
  }

  async updateUserWordById(bodyObj: UserWord): Promise<UserWord> {
    const request = await fetch(`${this.baseUrl}users/${bodyObj.id}/words/${bodyObj.wordId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(bodyObj),
    });
    return request.json();
  }

  async deleteUserWordById(userId: string, wordId: string) {
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

  async getUserStatisticsById(userId: string): Promise<UserStatistics> {
    const request = await fetch(`${this.baseUrl}users/${userId}/statistics`);
    return request.json();
  }

  async updateUserStatisticsById(
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

  async getSettingsById(userId: string): Promise<Settings[]> {
    const request = await fetch(`${this.baseUrl}users/${userId}/settings`);
    return request.json();
  }

  async updateSettingsById(bodyObj: Settings): Promise<Settings> {
    const request = await fetch(`${this.baseUrl}users/${bodyObj.userId}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(bodyObj),
    });
    return request.json();
  }

  async signIn(bodyObj: UpdateUser): Promise<SignInResponse> {
    const request = await fetch(`${this.baseUrl}signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(bodyObj),
    });
    return request.json();
  }

  async checkLearnWord(userId: string, wordId: string): Promise<CheckLearnedWord> {
    const request = await fetch(`${this.baseUrl}users/${userId}/learnedWords/${wordId}`);
    return request.json();
  }

  async getUserLearnWords(userId: string): Promise<AllUserLearnedWords> {
    const request = await fetch(`${this.baseUrl}users/${userId}/learnedWords`);
    return request.json();
  }

  async updateUserLearnedWords(userId: string, wordId: string): Promise<AllUserLearnedWords> {
    const request = await fetch(`${this.baseUrl}users/${userId}/learnedWords/${wordId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    return request.json();
  }

  async deleteUserLearnedWordByID(userId: string, wordId: string) {
    await fetch(`${this.baseUrl}users/${userId}/learnedWords/${wordId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
  }
}
