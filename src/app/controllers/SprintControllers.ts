import { Word } from '../../types/types';
import Api from '../models/Api';
import Games from '../views/Games';
import MelodyIcon from '../../assets/img/icons/melody.svg';
import BlockMelodyIcon from '../../assets/img/icons/melody_block.png';
import WrongSound from '../../assets/sounds/wrong_answer.mp3';
import RightSound from '../../assets/sounds/right_answer.wav';
import FinishSound from '../../assets/sounds/finish.mp3';

export default class SprintControllers {
  api: any;

  games: any;

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

  timer: ReturnType<typeof setTimeout>;

  constructor() {
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
    this.timer = setTimeout(() => {
      this.finishSprintGame();
    }, 62000);
  }

  async startSprintPage(group: string, page: string) {
    this.words = await this.api.getWords(group, page);
    for (let i = 0; i < this.words.length; i += 1) {
      this.questions.push(this.words[i].word);
      this.answers.push(this.words[i].wordTranslate);
    }
    this.games.renderSprintGame();
    this.listenRightBtn();
    this.listenWrongBtn();
    this.listenSoundBtn();
    this.listenFullScreenBtn();
    this.newSprintQuestion(this.questions, this.answers);
    return this.timer;
  }

  startSprintMenu(group: string) {
    this.startSprintPage(group, this.getRandomPage());
  }

  listenWrongBtn() {
    const wrongBtn: HTMLButtonElement = document.querySelector('.btn_wrong');
    wrongBtn?.addEventListener('click', () => {
      if (!this.checkAnswer()) {
        this.rightAction();
      } else {
        this.wrongAction();
      }
      this.newSprintQuestion(this.questions, this.answers);
    });

    document.addEventListener('keydown', (event) => {
      if (event.code === 'ArrowLeft') {
        wrongBtn.click();
      }
    });
  }

  listenRightBtn() {
    const rightBtn: HTMLButtonElement = document.querySelector('.btn_right');
    rightBtn?.addEventListener('click', () => {
      if (this.checkAnswer()) {
        this.rightAction();
      } else {
        this.wrongAction();
      }
      this.newSprintQuestion(this.questions, this.answers);
    });
    document.addEventListener('keydown', (event) => {
      if (event.code === 'ArrowRight') {
        rightBtn.click();
      }
    });
  }

  listenSoundBtn() {
    const soundBtn = document.querySelector('.btn__audio');
    soundBtn.addEventListener('click', () => {
      if (this.rightSound.muted === true && this.wrongSound.muted === true
        && this.finishSound.muted === true) {
        soundBtn.innerHTML = `<img src='${BlockMelodyIcon}' alt='sound-icon'>`;
        this.rightSound.muted = false;
        this.wrongSound.muted = false;
        this.finishSound.muted = false;
      } else {
        soundBtn.innerHTML = `<img src='${MelodyIcon}' alt='sound-icon'>`;
        this.rightSound.muted = true;
        this.wrongSound.muted = true;
        this.finishSound.muted = true;
      }
    });
  }

  listenFullScreenBtn() {
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

  newSprintQuestion(questions: string[], answers: string[]) {
    const english = document.querySelector('.console__english');
    const russian = document.querySelector('.console__russian');
    if (this.wordCounter < questions.length) {
      english.innerHTML = questions[this.wordCounter];
      russian.innerHTML = answers[this.getRandomIndex(this.wordCounter)];
      this.wordCounter += 1;
      console.log(this.wordCounter);
      console.log(questions.length);
    } else {
      this.wordCounter = 0;
      this.finishSprintGame();
      clearTimeout(this.timer);
    }
  }

  getRandomIndex(rightIndex: number) {
    if (rightIndex === this.answers.length || rightIndex + 4 > this.answers.length) {
      return Math.floor(Math.random() * (rightIndex - (rightIndex - 4))) + (rightIndex - 4);
    }
    return Math.floor(Math.random() * ((rightIndex + 4) - rightIndex)) + rightIndex;
  }

  getRandomPage() {
    return (Math.floor(Math.random() * (30 - 1)) + 1).toString();
  }

  checkAnswer() {
    const english = document.querySelector('.console__english');
    const russian = document.querySelector('.console__russian');
    if (this.questions.indexOf(english.innerHTML)
    === this.answers.indexOf(russian.innerHTML)) return true;
    return false;
  }

  checkCategory() {
    const category = document.querySelector('.points__category');
    if (this.categoryCounter === 4) {
      this.category += 10;
      this.categoryCounter = 0;
    }
    category.innerHTML = `+ ${this.category} баллов`;
  }

  updatePoints() {
    const points = document.querySelector('.points__current');
    points.innerHTML = this.points.toString();
  }

  checkCubes() {
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

  checkRow() {
    this.maxRow = this.maxRow < this.rowCounter ? this.rowCounter : this.maxRow;
  }

  resetCubes() {
    const activeCubes = document.querySelectorAll('.row__cube_active');
    if (activeCubes.length) {
      activeCubes.forEach((cube) => {
        cube.classList.remove('row__cube_active');
        cube.classList.add('row__cube');
      });
    }
  }

  rightAction() {
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

  wrongAction() {
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

  getMistakes() {
    const question = document.querySelector('.console__english');
    this.words.forEach((word) => {
      if (question.innerHTML === word.word) {
        this.mistakes.push(word);
      }
    });
  }

  getCorrect() {
    const question = document.querySelector('.console__english');
    this.words.forEach((word) => {
      if (question.innerHTML === word.word) {
        this.correct.push(word);
      }
    });
  }

  finishSprintGame() {
    this.finishSound.play();
    this.games.renderGameResults('Cпринт', this.mistakes, this.correct, this.points, this.maxRow);
  }
}
