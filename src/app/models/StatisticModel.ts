import { StatisicProperty, UserStatistics, Word } from '../../types/types';
import Api from './Api';

export default class StatisticModel {
  today: string;

  api: Api;

  constructor() {
    this.today = new Date().toLocaleDateString();
    this.api = new Api();
  }

  createProgressStorage() {
    const progress = {};
    localStorage.setItem('progress', JSON.stringify(progress));
  }

  getFullGameStatistic(
    game:string,
    userId: string,
    gameMaxRow: number,
    mistakes: Word[],
    correct: Word[],
  ): void {
    this.checkGameRow(game, userId, gameMaxRow);
    this.checkGameAccuracy(game, userId, mistakes, correct);
    this.updateProgress(game, userId, mistakes, correct);
  }

  async checkGameRow(game: string, userId: string, gameMaxRow: number): Promise<void> {
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    const { learnedWords } = userStatistics;
    if (game === 's') {
      if (Object.prototype.hasOwnProperty.call(userStatistics.optional, this.today)) {
        const currentRow = userStatistics.optional[this.today].sprintRow;
        if (currentRow < gameMaxRow) {
          this.api.updateUserStatisticsById(userId, {
            learnedWords,
            optional: {
              [this.today]: {
                sprintRow: gameMaxRow,
              },
            },
          });
        }
      } else {
        this.api.updateUserStatisticsById(userId, {
          learnedWords,
          optional: {
            [this.today]: {
              sprintRow: gameMaxRow,
            },
          },
        });
      }
    } else if (game === 'a') {
      if (Object.prototype.hasOwnProperty.call(userStatistics.optional, this.today)) {
        const currentRow = userStatistics.optional[this.today].audioRow;
        if (currentRow < gameMaxRow) {
          this.api.updateUserStatisticsById(userId, {
            learnedWords,
            optional: {
              [this.today]: {
                audioRow: gameMaxRow,
              },
            },
          });
        }
      } else {
        this.api.updateUserStatisticsById(userId, {
          learnedWords,
          optional: {
            [this.today]: {
              audioRow: gameMaxRow,
            },
          },
        });
      }
    }
  }

  async checkGameAccuracy(game: string, userId: string, mistakes: Word[], correct: Word[])
    : Promise<void> {
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    const { learnedWords } = userStatistics;
    if (mistakes.length + correct.length !== 0) {
      const gameAccuracy = Math.round((correct.length * 100) / (correct.length + mistakes.length));
      if (game === 's') {
        if (Object.prototype.hasOwnProperty.call(userStatistics.optional, this.today)) {
          const currentAccuracy = userStatistics.optional[this.today].sprintAccuracy;
          if (!currentAccuracy) {
            this.api.updateUserStatisticsById(userId, {
              learnedWords,
              optional: {
                [this.today]: {
                  sprintAccuracy: gameAccuracy,
                },
              },
            });
          } else {
            this.api.updateUserStatisticsById(userId, {
              learnedWords,
              optional: {
                [this.today]: {
                  sprintAccuracy: Math.round((currentAccuracy + gameAccuracy) / 2),
                },
              },
            });
          }
        } else {
          this.api.updateUserStatisticsById(userId, {
            learnedWords,
            optional: {
              [this.today]: {
                sprintAccuracy: gameAccuracy,
              },
            },
          });
        }
      } else if (game === 'a') {
        if (Object.prototype.hasOwnProperty.call(userStatistics.optional, this.today)) {
          const currentAccuracy = userStatistics.optional[this.today].audioAccuracy;
          if (!currentAccuracy) {
            this.api.updateUserStatisticsById(userId, {
              learnedWords,
              optional: {
                [this.today]: {
                  audioAccuracy: gameAccuracy,
                },
              },
            });
          } else {
            this.api.updateUserStatisticsById(userId, {
              learnedWords,
              optional: {
                [this.today]: {
                  audioAccuracy: Math.round((currentAccuracy + gameAccuracy) / 2),
                },
              },
            });
          }
        } else {
          this.api.updateUserStatisticsById(userId, {
            learnedWords,
            optional: {
              [this.today]: {
                audioAccuracy: gameAccuracy,
              },
            },
          });
        }
      }
    }
  }

  async getCommonDayAccuracy(userId: string): Promise<number> {
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    const { sprintAccuracy } = userStatistics.optional[this.today];
    const { audioAccuracy } = userStatistics.optional[this.today];
    let commonAccuracy: number;
    if (!sprintAccuracy) {
      commonAccuracy = audioAccuracy;
    } else if (!audioAccuracy) {
      commonAccuracy = sprintAccuracy;
    } else {
      commonAccuracy = Math.round((sprintAccuracy + audioAccuracy) / 2);
    }
    return commonAccuracy;
  }

  updateProgress(game: string, userId: string, mistakes: Word[], correct: Word[]) {
    const progress = JSON.parse(localStorage.getItem('progress'));
    let newWordsCounter = 0;
    for (let i = 0; i < mistakes.length; i += 1) {
      const wordId = mistakes[i].id;
      if (Object.prototype.hasOwnProperty.call(progress, wordId)) {
        progress[wordId].push(false);
      } else {
        progress[wordId] = [false];
        newWordsCounter += 1;
        this.checkIfLearnedWord(userId, wordId);
      }
    }
    for (let i = 0; i < correct.length; i += 1) {
      const wordId = correct[i].id;
      if (Object.prototype.hasOwnProperty.call(progress, wordId)) {
        progress[wordId].push(true);
      } else {
        progress[wordId] = [true];
        newWordsCounter += 1;
      }
    }
    localStorage.setItem('progress', JSON.stringify(progress));
    this.checkGameNewWords(game, userId, newWordsCounter);
    this.checkProgress(userId);
  }

  async checkGameNewWords(game: string, userId: string, newWords: number) {
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    const { learnedWords } = userStatistics;
    if (game === 's') {
      if (Object.prototype.hasOwnProperty.call(userStatistics.optional, this.today)) {
        const currentWords = userStatistics.optional[this.today].sprintNewWords;
        this.api.updateUserStatisticsById(userId, {
          learnedWords,
          optional: {
            [this.today]: {
              sprintNewWords: currentWords + newWords,
            },
          },
        });
      } else {
        this.api.updateUserStatisticsById(userId, {
          learnedWords,
          optional: {
            [this.today]: {
              sprintNewWords: newWords,
            },
          },
        });
      }
    } else if (game === 'a') {
      if (Object.prototype.hasOwnProperty.call(userStatistics.optional, this.today)) {
        const currentWords = userStatistics.optional[this.today].audioNewWords;
        this.api.updateUserStatisticsById(userId, {
          learnedWords,
          optional: {
            [this.today]: {
              audioNewWords: currentWords + newWords,
            },
          },
        });
      } else {
        this.api.updateUserStatisticsById(userId, {
          learnedWords,
          optional: {
            [this.today]: {
              audioNewWords: newWords,
            },
          },
        });
      }
    }
  }

  async checkIfLearnedWord(userId:string, wordId: string) {
    const wordCheck = await this.api.isWordLearned(userId, wordId);
    if (wordCheck.userLearnedWordsExists) {
      this.api.deleteUserLearnedWordById(userId, wordId);
      this.deleteWordFromLearned(userId);
    }
  }

  checkProgress(userId: string) {
    const progress = JSON.parse(localStorage.getItem('progress'));
    const words = Object.keys(progress);
    words.forEach(async (word) => {
      const userWord = await this.api.getUserWordById(userId, word);
      if (userWord.wordId) {
        this.checkDifficultWords(userId, word, progress[word]);
      } else {
        this.checkNormalWords(userId, word, progress[word]);
      }
    });
  }

  checkDifficultWords(userId:string, wordId: string, chances: boolean[]) {
    const check = chances.every((chance) => chance === true);
    if (chances.length === 5) {
      if (check) {
        this.api.deleteUserWordById(userId, wordId);
        this.api.updateUserLearnedWords(userId, wordId);
        this.addWordToLearned(userId);
      }
      chances.splice(0, 5);
    }
    if (chances.length && !check) {
      chances.splice(0, chances.length);
    }
  }

  checkNormalWords(userId:string, wordId: string, chances: boolean[]) {
    const check = chances.every((chance) => chance === true);
    if (chances.length === 3) {
      if (check) {
        this.api.deleteUserWordById(userId, wordId);
        this.api.updateUserLearnedWords(userId, wordId);
        this.addWordToLearned(userId);
      }
      chances.splice(0, 3);
    }
    if (chances.length && !check) {
      chances.splice(0, chances.length);
    }
  }

  async getLearnedWords(userId: string): Promise<number> {
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    const { optional } = userStatistics;
    if (Object.prototype.hasOwnProperty.call(userStatistics.optional, this.today)) {
      const currentLearnedWords = userStatistics.optional[this.today].learnedWords;
      console.log(currentLearnedWords);
      this.api.updateUserStatisticsById(userId, {
        learnedWords: currentLearnedWords,
        optional,
      });
    } else {
      this.api.updateUserStatisticsById(userId, {
        learnedWords: 0,
        optional,
      });
    }
    const { learnedWords } = userStatistics;
    return learnedWords;
  }

  async getNewWords(userId: string): Promise<number> {
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    if (Object.prototype.hasOwnProperty.call(userStatistics.optional, this.today)) {
      const { sprintNewWords } = userStatistics.optional[this.today];
      const { audioNewWords } = userStatistics.optional[this.today];
      return sprintNewWords + audioNewWords;
    }
    return 0;
  }

  async getTodayProperty(userId: string, property: StatisicProperty) {
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    if (Object.prototype.hasOwnProperty.call(userStatistics.optional, this.today)) {
      const propertyInfo = userStatistics.optional[this.today][property];
      return propertyInfo;
    }
    return 0;
  }

  async getFullTimeDates(userId: string): Promise<string[]> {
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    const endpoints = Object.keys(userStatistics.optional);
    return endpoints;
  }

  async getFullTimeNewWords(userId: string):Promise<number[]> {
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    const dates = Object.keys(userStatistics.optional);
    const endpoints: number[] = [];
    dates.map((date) => {
      const { sprintNewWords } = userStatistics.optional[date];
      const { audioNewWords } = userStatistics.optional[date];
      const dayNewWords = sprintNewWords + audioNewWords;
      return endpoints.push(dayNewWords);
    });
    return endpoints;
  }

  async getFullTimeDynimicLearned(userId: string):Promise<number[]> {
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    const dates = Object.keys(userStatistics.optional);
    const endpoints: number[] = [];
    let accum = 0;
    dates.map((date) => {
      const { learnedWords } = userStatistics.optional[date];
      accum += learnedWords;
      return endpoints.push(accum);
    });
    return endpoints;
  }

  async addWordToLearned(userId: string): Promise<void> {
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    const { learnedWords } = userStatistics;
    if (Object.prototype.hasOwnProperty.call(userStatistics.optional, this.today)) {
      const currentLearnedWords = userStatistics.optional[this.today].learnedWords;
      this.api.updateUserStatisticsById(userId, {
        learnedWords,
        optional: {
          [this.today]: {
            learnedWords: currentLearnedWords + 1,
          },
        },
      });
    } else {
      this.api.updateUserStatisticsById(userId, {
        learnedWords,
        optional: {
          [this.today]: {
            learnedWords: 1,
          },
        },
      });
    }
  }

  async deleteWordFromLearned(userId: string): Promise<void> {
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    const { learnedWords } = userStatistics;
    if (Object.prototype.hasOwnProperty.call(userStatistics.optional, this.today)) {
      const currentLearnedWords = userStatistics.optional[this.today].learnedWords;
      if (currentLearnedWords > 0) {
        this.api.updateUserStatisticsById(userId, {
          learnedWords,
          optional: {
            [this.today]: {
              learnedWords: currentLearnedWords - 1,
            },
          },
        });
      }
    }
  }
}
