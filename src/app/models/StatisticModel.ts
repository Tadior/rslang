import {
  Progress, StatisicProperty, UserStatistics, Word,
} from '../../types/types';
import Api from './Api';

export default class StatisticModel {
  today: string;

  api: Api;

  constructor() {
    this.today = new Date().toLocaleDateString();
    this.api = new Api();
  }

  public getFullGameStatistic(
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

  private async checkGameRow(game: string, userId: string, gameMaxRow: number): Promise<void> {
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

  private async checkGameAccuracy(game: string, userId: string, mistakes: Word[], correct: Word[])
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

  public async getCommonDayAccuracy(userId: string): Promise<number> {
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    if (Object.prototype.hasOwnProperty.call(userStatistics.optional, this.today)) {
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
    return 0;
  }

  private async updateProgress(game: string, userId: string, mistakes: Word[], correct: Word[])
    : Promise<void> {
    const progress: Progress = JSON.parse(localStorage.getItem('progress'));
    let newWordsCounter = 0;
    for (let i = 0; i < mistakes.length; i += 1) {
      const wordId = mistakes[i].id;
      if (Object.prototype.hasOwnProperty.call(progress, wordId)) {
        progress[wordId] = [];
      } else {
        progress[wordId] = [];
        newWordsCounter += 1;
        this.checkIfLearnedWord(userId, wordId);
      }
    }
    for (let i = 0; i < correct.length; i += 1) {
      const wordId = correct[i].id;
      if (Object.prototype.hasOwnProperty.call(progress, wordId)) {
        progress[wordId].push(true);
        if (progress[wordId].length === 3 || progress[wordId].length === 5) {
          progress[wordId] = await this.checkProgress(userId, wordId, progress); // eslint-disable-line 
        }
      } else {
        progress[wordId] = [true];
        newWordsCounter += 1;
      }
    }
    this.checkGameNewWords(game, userId, newWordsCounter);
    localStorage.removeItem('progress');
    localStorage.setItem('progress', JSON.stringify(progress));
  }

  private async checkGameNewWords(game: string, userId: string, newWords: number): Promise<void> {
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

  private async checkIfLearnedWord(userId:string, wordId: string): Promise<void> {
    const wordCheck = await this.api.isWordLearned(userId, wordId);
    if (wordCheck.userLearnedWordsExists) {
      this.api.deleteUserLearnedWordById(userId, wordId);
      this.deleteWordFromLearned(userId);
    }
  }

  private async checkProgress(userId: string, wordId: string, progress: Progress)
    :Promise <boolean[]> {
    const userWord = await this.api.getUserWordById(userId, wordId);
    let result: boolean[] = [];
    if (!userWord.wordId) {
      if (progress[wordId].length === 3) {
        await this.api.updateUserLearnedWords(userId, wordId);
        await this.addWordToLearned(userId);
        result = [];
      }
    } else if (progress[wordId].length === 5) {
      this.api.deleteUserWordById(userId, wordId);
      this.api.updateUserLearnedWords(userId, wordId);
      this.addWordToLearned(userId);
      result = [];
    } else {
      result = progress[wordId];
    }
    return result;
  }

  public async getLearnedWords(userId: string): Promise<number> {
    let learnedWords;
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    const { optional } = userStatistics;
    if (Object.prototype.hasOwnProperty.call(userStatistics.optional, this.today)) {
      const currentLearnedWords = userStatistics.optional[this.today].learnedWords;
      await this.api.updateUserStatisticsById(userId, {
        learnedWords: currentLearnedWords,
        optional,
      });
      learnedWords = currentLearnedWords;
    } else {
      await this.api.updateUserStatisticsById(userId, {
        learnedWords: 0,
        optional,
      });
      learnedWords = 0;
    }
    return learnedWords;
  }

  public async getNewWords(userId: string): Promise<number> {
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    if (Object.prototype.hasOwnProperty.call(userStatistics.optional, this.today)) {
      const { sprintNewWords } = userStatistics.optional[this.today];
      const { audioNewWords } = userStatistics.optional[this.today];
      return sprintNewWords + audioNewWords;
    }
    return 0;
  }

  public async getTodayProperty(userId: string, property: StatisicProperty): Promise<number> {
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    if (Object.prototype.hasOwnProperty.call(userStatistics.optional, this.today)) {
      const propertyInfo = userStatistics.optional[this.today][property];
      return propertyInfo;
    }
    return 0;
  }

  public async getFullTimeDates(userId: string): Promise<string[]> {
    const userStatistics: UserStatistics = (await this.api.getUserStatisticsById(userId))[0];
    const endpoints = Object.keys(userStatistics.optional);
    return endpoints;
  }

  public async getFullTimeNewWords(userId: string):Promise<number[]> {
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

  public async getFullTimeDynimicLearned(userId: string):Promise<number[]> {
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

  public async addWordToLearned(userId: string): Promise<void> {
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

  public async deleteWordFromLearned(userId: string): Promise<void> {
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
