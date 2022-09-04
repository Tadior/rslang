import { TQuestionsAnswers, UserWord, Word } from '../../types/types';
import Api from '../models/Api';
import Games from '../views/Games';
import MelodyIcon from '../../assets/img/icons/melody.svg';
import BlockMelodyIcon from '../../assets/img/icons/melody_block.png';
import WrongSound from '../../assets/sounds/wrong_answer.mp3';
import RightSound from '../../assets/sounds/right_answer.wav';
import FinishSound from '../../assets/sounds/finish.mp3';
import ResultsControllers from './ResultsControllers';
import listenIcon from '../../assets/img/sprint/listen_icon.png';

const url = 'http://localhost:4000/';

export default class AudioCallControllers {
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

  timer: ReturnType<typeof setTimeout>;

  resultControllers: ResultsControllers;

  wordName: string;

  questionsAnswers: TQuestionsAnswers;

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
    this.words = [];
    this.resultControllers = new ResultsControllers();
    this.wordName = '';
    this.questionsAnswers = {};
  }

  async startAudioCallPage(group: string, page: string, userId?: string): Promise<void> {
    if (userId) {
      this.words = await this.api.getWords(group, page);
      this.words = await this.checkIfLearned(userId, this.words);
      this.words = await this.checkWordsLength(userId, group, page, this.words);
    } else {
      this.words = await this.api.getWords(group, page);
    }
    for (let i = 0; i < this.words.length; i += 1) {
      this.questions.push(this.words[i].word);
      this.answers.push(this.words[i].wordTranslate);
      this.questionsAnswers[`${this.words[i].word}`] = this.words[i].wordTranslate;
    }
    this.games.renderAudioGame();
    this.listenSoundBtn();
    this.listenFullScreenBtn();
    this.newSprintQuestion(this.questions, this.answers);
    this.listenBtns();
  }

  public async startSprintMenu(group: string): Promise<void> {
    const page: string = (Math.floor(Math.random() * 29) + 1).toString();
    this.words = await this.api.getWords(group, page);
    for (let i = 0; i < this.words.length; i += 1) {
      this.questions.push(this.words[i].word);
      this.answers.push(this.words[i].wordTranslate);
      this.questionsAnswers[`${this.words[i].word}`] = this.words[i].wordTranslate;
    }
    this.games.renderAudioGame();
    this.listenSoundBtn();
    this.listenFullScreenBtn();
    this.newSprintQuestion(this.questions, this.answers);
    this.listenBtns();
  }

  async startAudioCallDictionary(userId: string) {
    const userWords = await this.api.getUserWords(userId);
    // eslint-disable-next-line no-restricted-syntax
    const dictionary = userWords.map(async (uWord) => {
      const word = await this.api.getWordById(uWord.wordId);
      console.log(word);
      this.words.push(word);
    });
    await Promise.all(dictionary);
    console.log(this.words);
    for (let i = 0; i < this.words.length; i += 1) {
      this.questions.push(this.words[i].word);
      this.answers.push(this.words[i].wordTranslate);
      this.questionsAnswers[`${this.words[i].word}`] = this.words[i].wordTranslate;
    }
    this.games.renderAudioGame();
    this.listenSoundBtn();
    this.listenFullScreenBtn();
    this.newSprintQuestion(this.questions, this.answers);
    this.listenBtns();
  }

  startSprintRandom(): void {
    const group = (Math.floor(Math.random() * 5) + 1).toString();
    const page = (Math.floor(Math.random() * 29) + 1).toString();
    this.startAudioCallPage(group, page);
  }

  listenWrongBtn(): void {
    const wrongBtn: HTMLButtonElement = document.querySelector('.btn_wrong');
    wrongBtn?.addEventListener('click', () => {
      if (!this.checkAnswer('2')) {
        // this.rightAction();
      } else {
        // this.wrongAction();
      }
      this.newSprintQuestion(this.questions, this.answers);
    });

    document.addEventListener('keydown', (event) => {
      if (event.code === 'ArrowLeft') {
        wrongBtn.click();
      }
    });
  }

  listenRightBtn(): void {
    const rightBtn: HTMLButtonElement = document.querySelector('.btn_right');
    rightBtn?.addEventListener('click', () => {
      // if (this.checkAnswer()) {
      // this.rightAction();
      // } else {
      // this.wrongAction();
      // }
      this.newSprintQuestion(this.questions, this.answers);
    });
    document.addEventListener('keydown', (event) => {
      if (event.code === 'ArrowRight') {
        rightBtn.click();
      }
    });
  }

  listenAnswersBtns() {
    const answersBtns = document.querySelectorAll('.audio-call__answer');
    const audioBtnIdk: HTMLButtonElement = document.querySelector('.audio-call__btn-idk');
    answersBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const answer = btn.innerHTML;
        const checkedAnswer = this.checkAnswer(answer);
        if (checkedAnswer.isCorrectAnswer) {
          this.rightAction();
        } else {
          this.wrongAction();
          btn.classList.toggle('audio-call__answer_wrong');
        }
        this.disableBtns();
        this.resultObserver();
        audioBtnIdk.innerHTML = '🠒';
        // this.newSprintQuestion(this.questions, this.answers);
      });
    });
  }

  resultObserver() {
    console.log('resultObserver');
    const button: HTMLButtonElement = document.querySelector('.audio-call-button');
    button.classList.toggle('btn_hide');
    const img: HTMLElement = document.querySelector('.audio-call-img');
    const audioBtn: HTMLDivElement = document.querySelector('.audio-call-button');
    const correct = audioBtn.getAttribute('data-word');
    const audioContainer = document.querySelector('.audio-call-container');
    const audioContainerIco = document.querySelector('.audio-call-container__ico');
    audioContainer.classList.toggle('word_hide');
    const audioContainerWord = document.querySelector('.audio-call-container__word');
    audioContainerWord.innerHTML = correct;
    console.log(this.getWordImg(correct));
    img.style.margin = `${this.getWordImg(correct)}`;
    img.setAttribute('style', `background-image: url(${this.getWordImg(correct)});`);
    audioContainerIco.setAttribute('style', `background-image: url(${listenIcon});`);
    console.log(img);
    img.classList.toggle('img_hide');
  }

  listenBtns() {
    const answers = document.querySelector('.audio-call__answers');
    const audioListenBtn: HTMLButtonElement = document.querySelector('.audio-call-button');
    const audioListenAnswer: HTMLButtonElement = document.querySelector('.audio-call-container__ico');
    const audioBtnIdk: HTMLButtonElement = document.querySelector('.audio-call__btn-idk');
    const audioContainer = document.querySelector('.audio-call-container');
    const img: HTMLElement = document.querySelector('.audio-call-img');
    const button: HTMLButtonElement = document.querySelector('.audio-call-button');
    audioBtnIdk.addEventListener('click', () => {
      switch (audioBtnIdk.innerHTML) {
        case '🠒':
          answers.innerHTML = '';
          audioContainer.classList.toggle('word_hide');
          img.classList.toggle('img_hide');
          button.classList.toggle('btn_hide');
          this.newSprintQuestion(this.questions, this.answers);
          audioBtnIdk.innerHTML = 'Я не знаю :(';
          break;

        default:
          this.wrongSound.play();
          this.getMistakes();
          this.disableBtns();
          this.resultObserver();
          audioBtnIdk.innerHTML = '🠒';
          break;
      }
      this.listenAnswersBtns();
    });
    this.listenAnswersBtns();
    audioListenBtn.addEventListener('click', () => {
      audioListenBtn.disabled = true;
      // eslint-disable-next-line no-return-assign
      setTimeout(() => {
        audioListenBtn.disabled = false;
      }, 500);
      this.getAndPlayWordSound(this.wordName);
    });

    audioListenAnswer.addEventListener('click', () => {
      audioListenAnswer.disabled = true;
      // eslint-disable-next-line no-return-assign
      setTimeout(() => {
        audioListenAnswer.disabled = false;
      }, 500);
      this.getAndPlayWordSound(this.wordName);
    });
  }

  private disableBtns() {
    const answersBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.audio-call__answer');
    const audioBtn: HTMLDivElement = document.querySelector('.audio-call-button');
    const correct = audioBtn.getAttribute('data-word');
    answersBtns.forEach((btn: HTMLButtonElement) => {
      // eslint-disable-next-line no-param-reassign
      btn.disabled = true;
      // if (btn.innerHTML === this.questionsAnswers[`${correct}`]) {
      if (btn.innerHTML === this.questionsAnswers[`${correct}`]) {
        btn.classList.toggle('audio-call__answer_right');
      }
      if (btn.classList.contains('audio-call__answer_right') === false && btn.classList.contains('audio-call__answer_wrong') === false) {
        btn.classList.toggle('audio-call__answer_neutral');
      }
    });
  }

  private getAndPlayWordSound(wordName: string) {
    const word: Word = this.words.filter((el) => el.word === wordName)[0];
    const audio = new Audio(`${url}${word.audio}`);
    audio.play();
  }

  private getWordImg(wordName: string) {
    const word: Word = this.words.filter((el) => el.word === wordName)[0];
    const image = `${url}${word.image}`;
    return image;
  }

  listenSoundBtn(): void {
    const soundBtn = document.querySelector('.btn__audio');
    soundBtn.addEventListener('click', () => {
      // eslint-disable-next-line max-len
      if (this.rightSound.muted === true && this.wrongSound.muted === true && this.finishSound.muted === true) {
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

  listenFullScreenBtn(): void {
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

  newSprintQuestion(questions: string[], answers: string[]): void {
    console.log('CCC');
    const answersContainer = document.querySelector('.audio-call__answers');
    const audioBtn: HTMLButtonElement = document.querySelector('.audio-call-button');
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    audioBtn.setAttribute('data-word', questions[this.wordCounter]);
    this.wordName = questions[this.wordCounter];
    const generatedArray = [this.wordCounter].concat(this.generateArray(questions.length));
    // const english = document.querySelector('.console__english');
    // const russian = document.querySelector('.console__russian');
    console.log(this.wordCounter);
    console.log(questions.length);
    if (this.wordCounter < questions.length) {
      this.getAndPlayWordSound(questions[this.wordCounter]);
      // english.innerHTML = questions[this.wordCounter];
      const idxArr: number[] = [];
      idxArr.push(this.wordCounter);
      for (let index = 0; index < 4; index += 1) {
        const idx = this.getRandomIndex(this.wordCounter, idxArr, generatedArray);
        idxArr.push(idx);
      }
      this.shuffle(idxArr).forEach((el) => {
        // prettier-ignore;
        const word = answers[el];
        answersContainer.innerHTML += `<button class="audio-call__answer">${word}</button>`;
      });
      // russian.innerHTML = answers[this.getRandomIndex(this.wordCounter)];
      this.wordCounter += 1;
    } else {
      this.wordCounter = 0;
      this.finishSprintGame();
    }
  }

  getRandomIndex(rightIndex: number, idxArr: number[], generatedArray: number[]): number {
    const item = generatedArray[Math.floor(Math.random() * generatedArray.length)];
    if (idxArr.includes(item)) {
      return this.getRandomIndex(rightIndex, idxArr, generatedArray);
    }
    return item;
  }

  // Fisher-Yates Algorithm
  shuffle(array: number[]): number[] {
    const copyArray = array.slice();
    for (let index = array.length - 1; index > 0; index -= 1) {
      const j = Math.floor(Math.random() * (index + 1));
      [copyArray[index], copyArray[j]] = [copyArray[j], copyArray[index]];
    }
    return copyArray;
  }

  generateArray(length: number) {
    return Array(length - 1)
      .fill(0)
      .map((_, i) => i + 1);
  }

  async checkIfLearned(userId: string, words: Word[]): Promise<Word[]> {
    const results = await Promise.all(
      words.map((word) => {
        const wordCheck = this.api.isWordLearned(userId, word.id);
        return wordCheck;
        // eslint-disable-next-line @typescript-eslint/comma-dangle
      })
    );
    const filteredWords = words.filter((_word, index) => !results[index].userLearnedWordsExists);
    return filteredWords;
  }

  // eslint-disable-next-line max-len
  async checkWordsLength(userId: string, group: string, page: string, words: Word[]): Promise<Word[]> {
    if (words.length < 20 && Number(page) > 1) {
      let concatWords = await this.api.getWords(group, (Number(page) - 1).toString());
      concatWords = await this.checkIfLearned(userId, concatWords);
      words = words.concat(concatWords); // eslint-disable-line
      this.checkWordsLength(userId, group, (Number(page) - 1).toString(), words);
    }
    words = words.slice(0, 20); // eslint-disable-line
    return words;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkAnswer(russian: string) {
    const audioBtn: HTMLButtonElement = document.querySelector('.audio-call-button');
    const english = audioBtn.getAttribute('data-word');
    // eslint-disable-next-line max-len
    if (this.questions.indexOf(english) === this.answers.indexOf(russian)) {
      return {
        isCorrectAnswer: true,
        russian: this.answers[this.answers.indexOf(russian)],
        english: this.questions[this.questions.indexOf(english)],
      };
    }
    return {
      isCorrectAnswer: false,
      russian: this.answers[this.answers.indexOf(russian)],
      english: this.questions[this.questions.indexOf(english)],
    };
  }

  checkCategory(): void {
    if (this.categoryCounter === 4) {
      this.category += 10;
      this.categoryCounter = 0;
    }
  }

  checkCubes(): void {
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

  checkRow(): void {
    this.maxRow = this.maxRow < this.rowCounter ? this.rowCounter : this.maxRow;
  }

  resetCubes(): void {
    const activeCubes = document.querySelectorAll('.row__cube_active');
    if (activeCubes.length) {
      activeCubes.forEach((cube) => {
        cube.classList.remove('row__cube_active');
        cube.classList.add('row__cube');
      });
    }
  }

  rightAction(): void {
    this.rightSound.play();
    this.rightSound.currentTime = 0;
    this.categoryCounter += 1;
    this.checkCubes();
    this.points += this.category;
    this.checkCategory();
    this.rowCounter += 1;
    this.getCorrect();
  }

  wrongAction(): void {
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

  getMistakes(): void {
    const audioBtn: HTMLButtonElement = document.querySelector('.audio-call-button');
    const english = audioBtn.getAttribute('data-word');
    this.words.forEach((word) => {
      if (english === word.word) {
        this.mistakes.push(word);
      }
    });
  }

  getCorrect(): void {
    const audioBtn: HTMLButtonElement = document.querySelector('.audio-call-button');
    const english = audioBtn.getAttribute('data-word');
    this.words.forEach((word) => {
      if (english === word.word) {
        this.correct.push(word);
      }
    });
  }

  finishSprintGame(): void {
    console.log('Finish');
    this.finishSound.play();
    this.games.renderGameResults('Аудиовызов', this.mistakes, this.correct, this.points, this.maxRow);
    const resultRow: HTMLElement = document.querySelector('.result__row');
    const resultPoints: HTMLElement = document.querySelector('.result__points');
    resultRow.style.display = 'none';
    resultPoints.style.marginBottom = '30px';
    this.resultControllers.listenHomeBtn();
    this.resultControllers.listenAudioBtn();
    this.listenNewGameBtn();
  }

  listenNewGameBtn(): void {
    const newGameBtn = document.querySelector('.btn__new-game');
    newGameBtn.addEventListener('click', () => {
      const newGame = new AudioCallControllers();
      newGame.startSprintRandom();
    });
  }
}
