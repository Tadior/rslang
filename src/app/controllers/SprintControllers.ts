import { Word } from '../../types/types';
import Api from '../models/Api';
import Games from '../views/Games';

export default class SprintControllers {
  api: any;

  games: any;

  wordCounter: number;

  questions: string[];

  answers: string[];

  category: number;

  categoryCounter: number;

  points: number;

  wrongSound: HTMLAudioElement;

  rightSound: HTMLAudioElement;

  constructor() {
    this.api = new Api();
    this.games = new Games();
    this.wordCounter = 0;
    this.questions = [];
    this.answers = [];
    this.categoryCounter = 0;
    this.category = 10;
    this.points = 0;
    this.wrongSound = new Audio('../../assets/sounds/wrong_answer.mp3');
    this.rightSound = new Audio('../../assets/sounds/right_answer.wav');
  }

  async startSprintPage() {
    const words: Word[] = await this.api.getWords('1', '1');
    for (let i = 0; i < words.length; i += 1) {
      this.questions.push(words[i].word);
      this.answers.push(words[i].wordTranslate);
    }
    this.games.renderSprintGame();
    this.listenRightBtn();
    this.listenWrongBtn();
    this.newSprintQuestion(this.questions, this.answers);
  }

  startSprintMenu() {
    console.log('error');
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
    }
  }

  getRandomIndex(rightIndex: number) {
    if (rightIndex === this.answers.length || rightIndex + 4 > this.answers.length) {
      return Math.floor(Math.random() * (rightIndex - (rightIndex - 4))) + (rightIndex - 4);
    }
    return Math.floor(Math.random() * ((rightIndex + 4) - rightIndex)) + rightIndex;
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
  }

  wrongAction() {
    this.wrongSound.play();
    this.wrongSound.currentTime = 0;
    this.categoryCounter = 0;
    this.category = 10;
    this.checkCategory();
    this.resetCubes();
  }
}
