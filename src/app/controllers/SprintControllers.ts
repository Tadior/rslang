import { User, Word } from '../../types/types';
import Api from '../models/Api';
import Games from '../views/Games';
import MelodyIcon from '../../assets/img/icons/melody.svg';
import BlockMelodyIcon from '../../assets/img/icons/melody_block.png';
import WrongSound from '../../assets/sounds/wrong_answer.mp3';
import RightSound from '../../assets/sounds/right_answer.wav';
import FinishSound from '../../assets/sounds/finish.mp3';
import ResultsControllers from './ResultsControllers';
import StatisticModel from '../models/StatisticModel';
import AuthorizationControllers from './AuthorizationControllers';

export default class SprintControllers {
  api: Api;

  games: Games;

  words: Word[];

  wordCounter: number;

  questions: string[];

  answers: string[];

  category: number;

  categoryCounter: number;

  points: number;

  wrongSound: HTMLAudioElement;

  rightSound: HTMLAudioElement;

  finishSound: HTMLAudioElement;

  rowCounter: number;

  maxRow: number;

  mistakes: Word[];

  correct: Word[];

  timer: any;

  resultControllers: ResultsControllers;

  statistic: StatisticModel;

  authorization: AuthorizationControllers;

  userInfo: User;

  constructor() {
    this.authorization = new AuthorizationControllers();
    this.userInfo = this.authorization.getUserFromLocalStorage();
    this.api = new Api();
    this.games = new Games();
    this.wordCounter = 0;
    this.questions = [];
    this.answers = [];
    this.categoryCounter = 0;
    this.category = 10;
    this.points = 0;
    this.wrongSound = new Audio(`${WrongSound}`);
    this.rightSound = new Audio(`${RightSound}`);
    this.finishSound = new Audio(`${FinishSound}`);
    this.rowCounter = 0;
    this.maxRow = 0;
    this.mistakes = [];
    this.correct = [];
    this.resultControllers = new ResultsControllers();
    this.statistic = new StatisticModel();
  }

  public async startSprintPage(group: string, page: string): Promise<void> {
    this.timer = () => {
      setTimeout(() => {
        this.finishSprintGame();
      }, 62000);
    };
    if (this.userInfo) {
      this.words = await this.api.getWords(group, page);
      this.words = await this.checkIfLearned(this.userInfo.userId, this.words);
      this.words = await this.checkWordsPage(group, page, this.words, this.userInfo.userId);
    } else {
      this.words = await this.api.getWords(group, page);
      this.words = await this.checkWordsPage(group, page, this.words);
    }
    for (let i = 0; i < this.words.length; i += 1) {
      this.questions.push(this.words[i].word);
      this.answers.push(this.words[i].wordTranslate);
    }
    this.games.renderSprintGame();
    this.listenRightBtn();
    this.listenWrongBtn();
    this.listenSoundBtn();
    this.listenFullScreenBtn();
    this.newSprintQuestion();
    this.timer();
  }

  public async startSprintMenu(group: string): Promise<void> {
    this.timer = () => {
      setTimeout(() => {
        this.finishSprintGame();
      }, 62000);
    };
    const page = (Math.floor(Math.random() * 29)).toString();
    this.words = await this.api.getWords(group, page);
    this.words = await this.checkWordsPage(group, page, this.words);
    for (let i = 0; i < this.words.length; i += 1) {
      this.questions.push(this.words[i].word);
      this.answers.push(this.words[i].wordTranslate);
    }
    this.games.renderSprintGame();
    this.listenRightBtn();
    this.listenWrongBtn();
    this.listenSoundBtn();
    this.listenFullScreenBtn();
    this.newSprintQuestion();
    this.timer();
  }

  public async startSprintDictionary(userId:string): Promise<void> {
    this.timer = () => {
      setTimeout(() => {
        this.finishSprintGame();
      }, 62000);
    };
    const userWords = await this.api.getUserWords(userId);
    userWords.map(async (uWord) => {
      const word = await this.api.getWordById(uWord.wordId);
      this.words.push(word);
    });
    for (let i = 0; i < this.words.length; i += 1) {
      this.questions.push(this.words[i].word);
      this.answers.push(this.words[i].wordTranslate);
    }
    this.games.renderSprintGame();
    this.listenRightBtn();
    this.listenWrongBtn();
    this.listenSoundBtn();
    this.listenFullScreenBtn();
    this.newSprintQuestion();
    this.timer();
  }

  public startSprintRandom(): void {
    const group = (Math.floor(Math.random() * 5)).toString();
    const page = (Math.floor(Math.random() * 29)).toString();
    this.startSprintPage(group, page);
  }

  private listenWrongBtn(): void {
    const wrongBtn: HTMLButtonElement = document.querySelector('.btn_wrong');
    wrongBtn?.addEventListener('click', () => {
      if (!this.checkAnswer()) {
        this.rightAction();
      } else {
        this.wrongAction();
      }
      this.newSprintQuestion();
    });

    document.addEventListener('keyup', (event) => {
      if (event.code === 'ArrowLeft') {
        wrongBtn.click();
      }
    });
  }

  private listenRightBtn(): void {
    const rightBtn: HTMLButtonElement = document.querySelector('.btn_right');
    rightBtn?.addEventListener('click', () => {
      if (this.checkAnswer()) {
        this.rightAction();
      } else {
        this.wrongAction();
      }
      this.newSprintQuestion();
    });
    document.addEventListener('keyup', (event) => {
      if (event.code === 'ArrowRight') {
        rightBtn.click();
      }
    });
  }

  private listenSoundBtn(): void {
    const soundBtn = document.querySelector('.btn__audio');
    soundBtn.addEventListener('click', () => {
      if (this.rightSound.muted === true && this.wrongSound.muted === true
        && this.finishSound.muted === true) {
        soundBtn.innerHTML = `<img src='${MelodyIcon}' alt='sound-icon'>`;
        this.rightSound.muted = false;
        this.wrongSound.muted = false;
        this.finishSound.muted = false;
      } else {
        soundBtn.innerHTML = `<img src='${BlockMelodyIcon}' alt='sound-icon'>`;
        this.rightSound.muted = true;
        this.wrongSound.muted = true;
        this.finishSound.muted = true;
      }
    });
  }

  private listenFullScreenBtn(): void {
    const gameScreen = document.querySelector('.game');
    const fullscreenBtn = document.querySelector('.btn__window');
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        gameScreen.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  }

  private newSprintQuestion(): void {
    const english = document.querySelector('.console__english');
    const russian = document.querySelector('.console__russian');
    if (this.wordCounter < this.questions.length) {
      english.innerHTML = this.questions[this.wordCounter];
      russian.innerHTML = this.answers[this.getRandomIndex(this.wordCounter)];
      this.wordCounter += 1;
    } else {
      this.wordCounter = 0;
      this.finishSprintGame();
      clearTimeout(this.timer);
    }
  }

  private getRandomIndex(rightIndex: number): number {
    if (this.answers.length <= 4) {
      return rightIndex;
    }
    if (rightIndex === this.answers.length - 1 || rightIndex + 4 > this.answers.length - 1) {
      return Math.floor(Math.random() * (rightIndex - (rightIndex - 4))) + (rightIndex - 4);
    }
    return Math.floor(Math.random() * ((rightIndex + 4) - rightIndex)) + rightIndex;
  }

  private async checkIfLearned(userId: string, words: Word[]): Promise<Word[]> {
    const results = await Promise.all(words.map((word) => {
      const wordCheck = this.api.isWordLearned(userId, word.id);
      return wordCheck;
    }));
    const filteredWords = words.filter((_word, index) => !results[index].userLearnedWordsExists);
    return filteredWords;
  }

  private async checkWordsPage(group: string, page: string, words: Word[], userId?: string)
    : Promise<Word[]> {
    let allWords: Word[];
    if (Number(page) > 1) {
      let concatWords = await this.api.getWords(group, (Number(page) - 1).toString());
      if (userId) {
        concatWords = await this.checkIfLearned(userId, concatWords);
        allWords = words.concat(concatWords);
      } else {
        allWords = words.concat(concatWords);
      }
      return this.checkWordsPage(group, (Number(page) - 1).toString(), allWords);
    }
    allWords = words;
    return allWords;
  }

  private checkAnswer(): boolean {
    const english = document.querySelector('.console__english');
    const russian = document.querySelector('.console__russian');
    if (this.questions.indexOf(english.innerHTML)
    === this.answers.indexOf(russian.innerHTML)) return true;
    return false;
  }

  private checkCategory(): void {
    const category = document.querySelector('.points__category');
    if (this.categoryCounter === 4) {
      this.category += 10;
      this.categoryCounter = 0;
    }
    category.innerHTML = `+ ${this.category} баллов`;
  }

  private updatePoints(): void {
    const points = document.querySelector('.points__current');
    points.innerHTML = this.points.toString();
  }

  private checkCubes(): void {
    const cubes = document.querySelectorAll('.row__cube');
    if (!cubes.length) {
      const activeCubes = document.querySelectorAll('.row__cube_active');
      activeCubes.forEach((cube) => {
        cube.classList.remove('row__cube_active');
        cube.classList.add('row__cube');
      });
    }
    if (cubes.length > 0 && this.categoryCounter <= 3) {
      cubes[0].classList.remove('row__cube');
      cubes[0].classList.add('row__cube_active');
    }
  }

  private checkRow(): void {
    if (this.maxRow < this.rowCounter) {
      this.maxRow = this.rowCounter;
    }
  }

  private resetCubes(): void {
    const activeCubes = document.querySelectorAll('.row__cube_active');
    if (activeCubes.length) {
      activeCubes.forEach((cube) => {
        cube.classList.remove('row__cube_active');
        cube.classList.add('row__cube');
      });
    }
  }

  private rightAction(): void {
    this.rightSound.play();
    this.rightSound.currentTime = 0;
    this.categoryCounter += 1;
    this.checkCubes();
    this.points += this.category;
    this.updatePoints();
    this.checkCategory();
    this.rowCounter += 1;
    this.getCorrect();
  }

  private wrongAction(): void {
    this.wrongSound.play();
    this.wrongSound.currentTime = 0;
    this.categoryCounter = 0;
    this.category = 10;
    this.checkCategory();
    this.resetCubes();
    this.checkRow();
    this.rowCounter = 0;
    this.getMistakes();
  }

  private getMistakes(): void {
    const question = document.querySelector('.console__english');
    this.words.forEach((word) => {
      if (question.innerHTML === word.word) {
        this.mistakes.push(word);
      }
    });
  }

  private getCorrect(): void {
    const question = document.querySelector('.console__english');
    this.words.forEach((word) => {
      if (question.innerHTML === word.word) {
        this.correct.push(word);
      }
    });
  }

  private finishSprintGame(): void {
    this.finishSound.play();
    this.checkRow();
    this.games.renderGameResults('Cпринт', this.mistakes, this.correct, this.points, this.maxRow);
    if (this.userInfo) {
      this.statistic.getFullGameStatistic('s', this.userInfo.userId, this.maxRow, this.mistakes, this.correct);
    }

    this.resultControllers.listenHomeBtn();
    this.resultControllers.listenAudioBtn();
    this.listenNewGameBtn();
  }

  private listenNewGameBtn(): void {
    const newGameBtn = document.querySelector('.btn__new-game');
    newGameBtn.addEventListener('click', () => {
      const newGame = new SprintControllers();
      newGame.startSprintRandom();
    });
  }
}
