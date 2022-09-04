// prettier-ignore
import {
  ICheckAnswer,
  TQuestionsAnswers,
  User,
  UserWord, Word,
} from '../../types/types';
import Api from '../models/Api';
import Games from '../views/Games';
import MelodyIcon from '../../assets/img/icons/melody.svg';
import BlockMelodyIcon from '../../assets/img/icons/melody_block.png';
import WrongSound from '../../assets/sounds/wrong_answer.mp3';
import RightSound from '../../assets/sounds/right_answer.wav';
import FinishSound from '../../assets/sounds/finish.mp3';
import ResultsControllers from './ResultsControllers';
import listenIcon from '../../assets/img/sprint/listen_icon.png';
import url from '../models/variables';
import AuthorizationControllers from './AuthorizationControllers';

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
    this.words = [];
    this.resultControllers = new ResultsControllers();
    this.wordName = '';
    this.questionsAnswers = {};
  }

  async startAudioCallPage(group: string, page: string): Promise<void> {
    if (this.userInfo) {
      this.words = await this.api.getWords(group, page);
      this.words = await this.checkIfLearned(this.userInfo.userId, this.words);
      this.words = await this.checkWordsPage(group, page, this.words, this.userInfo.userId);
    } else {
      this.words = await this.checkWordsPage(group, page, this.words);
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

  public async startAudioCallMenu(group: string): Promise<void> {
    const page: string = Math.floor(Math.random() * 29).toString();
    this.words = await this.api.getWords(group, page);
    this.words = await this.checkWordsPage(group, page, this.words);
    for (let i = 0; i < this.words.length; i += 1) {
      this.questions.push(this.words[i].word);
      this.answers.push(this.words[i].wordTranslate);
      this.questionsAnswers[`${this.words[i].word}`] = this.words[i].wordTranslate;
    }
    console.log(this.questions);
    this.games.renderAudioGame();
    this.listenSoundBtn();
    this.listenFullScreenBtn();
    this.newSprintQuestion(this.questions, this.answers);
    this.listenBtns();
  }

  public async startAudioCallDictionary(userId: string): Promise<void> {
    const userWords: UserWord[] = await this.api.getUserWords(userId);
    const dictionary: Promise<void>[] = userWords.map(async (uWord) => {
      const word = await this.api.getWordById(uWord.wordId);
      this.words.push(word);
    });
    await Promise.all(dictionary);
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

  public startAudioCallRandom(): void {
    const group = (Math.floor(Math.random() * 5) + 1).toString();
    const page = (Math.floor(Math.random() * 29) + 1).toString();
    this.startAudioCallPage(group, page);
  }

  private listenAnswersBtns(): void {
    const answersBtns: NodeListOf<HTMLElement> = document.querySelectorAll('.audio-call__answer');
    const audioBtnIdk: HTMLButtonElement = document.querySelector('.audio-call__btn-idk');
    answersBtns.forEach((btn: HTMLElement) => {
      btn.addEventListener('click', (): void => {
        const answer: string = btn.innerHTML;
        const checkedAnswer: ICheckAnswer = this.checkAnswer(answer);
        if (checkedAnswer.isCorrectAnswer) {
          this.rightAction();
        } else {
          this.wrongAction();
          btn.classList.toggle('audio-call__answer_wrong');
        }
        this.disableBtns();
        this.resultObserver();
        audioBtnIdk.innerHTML = '🠒';
      });
    });
  }

  private resultObserver(): void {
    const button: HTMLButtonElement = document.querySelector('.audio-call-button');
    button.classList.toggle('btn_hide');
    const img: HTMLElement = document.querySelector('.audio-call-img');
    const audioBtn: HTMLDivElement = document.querySelector('.audio-call-button');
    const correct: string = audioBtn.getAttribute('data-word');
    const audioContainer: HTMLElement = document.querySelector('.audio-call-container');
    const audioContainerIco: HTMLButtonElement = document.querySelector('.audio-call-container__ico');
    audioContainer.classList.toggle('word_hide');
    const audioContainerWord: HTMLElement = document.querySelector('.audio-call-container__word');
    audioContainerWord.innerHTML = correct;
    img.style.margin = `${this.getWordImg(correct)}`;
    img.setAttribute('style', `background-image: url(${this.getWordImg(correct)});`);
    audioContainerIco.setAttribute('style', `background-image: url(${listenIcon});`);
    img.classList.toggle('img_hide');
  }

  private listenBtns(): void {
    const answers: HTMLElement = document.querySelector('.audio-call__answers');
    const audioListenBtn: HTMLButtonElement = document.querySelector('.audio-call-button');
    const audioListenAnswer: HTMLButtonElement = document.querySelector('.audio-call-container__ico');
    const audioBtnIdk: HTMLButtonElement = document.querySelector('.audio-call__btn-idk');
    const audioContainer = document.querySelector('.audio-call-container');
    const img: HTMLElement = document.querySelector('.audio-call-img');
    const button: HTMLButtonElement = document.querySelector('.audio-call-button');
    audioBtnIdk.addEventListener('click', (): void => {
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
    audioListenBtn.addEventListener('click', (): void => {
      audioListenBtn.disabled = true;
      setTimeout(() => {
        audioListenBtn.disabled = false;
      }, 500);
      this.getAndPlayWordSound(this.wordName);
    });

    audioListenAnswer.addEventListener('click', (): void => {
      audioListenAnswer.disabled = true;
      setTimeout(() => {
        audioListenAnswer.disabled = false;
      }, 500);
      this.getAndPlayWordSound(this.wordName);
    });
  }

  private disableBtns(): void {
    const answersBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.audio-call__answer');
    const audioBtn: HTMLDivElement = document.querySelector('.audio-call-button');
    const correct = audioBtn.getAttribute('data-word');
    answersBtns.forEach((btn: HTMLButtonElement) => {
      // eslint-disable-next-line no-param-reassign
      btn.disabled = true;
      if (btn.innerHTML === this.questionsAnswers[`${correct}`]) {
        btn.classList.toggle('audio-call__answer_right');
      }
      if (btn.classList.contains('audio-call__answer_right') === false && btn.classList.contains('audio-call__answer_wrong') === false) {
        btn.classList.toggle('audio-call__answer_neutral');
      }
    });
  }

  private getAndPlayWordSound(wordName: string): void {
    const word: Word = this.words.filter((el) => el.word === wordName)[0];
    const audio = new Audio(`${url}${word.audio}`);
    audio.play();
  }

  private getWordImg(wordName: string): string {
    const word: Word = this.words.filter((el) => el.word === wordName)[0];
    const image = `${url}${word.image}`;
    return image;
  }

  private listenSoundBtn(): void {
    const soundBtn: HTMLElement = document.querySelector('.btn__audio');
    soundBtn.addEventListener('click', (): void => {
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

  private listenFullScreenBtn(): void {
    const gameScreen: HTMLElement = document.querySelector('.game');
    const fullscreenBtn: HTMLElement = document.querySelector('.btn__window');
    fullscreenBtn.addEventListener('click', (): void => {
      if (!document.fullscreenElement) {
        gameScreen.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  }

  private newSprintQuestion(questions: string[], answers: string[]): void {
    const answersContainer = document.querySelector('.audio-call__answers');
    const audioBtn: HTMLButtonElement = document.querySelector('.audio-call-button');
    audioBtn.setAttribute('data-word', questions[this.wordCounter]);
    this.wordName = questions[this.wordCounter];
    // eslint-disable-next-line max-len
    const generatedArray: number[] = [this.wordCounter].concat(this.generateArray(questions.length));
    if (this.wordCounter < questions.length) {
      this.getAndPlayWordSound(questions[this.wordCounter]);
      const idxArr: number[] = [];
      idxArr.push(this.wordCounter);
      for (let index = 0; index < 4; index += 1) {
        const idx = this.getRandomIndex(this.wordCounter, idxArr, generatedArray);
        idxArr.push(idx);
      }
      this.shuffle(idxArr).forEach((el) => {
        const word = answers[el];
        answersContainer.innerHTML += `<button class="audio-call__answer">${word}</button>`;
      });
      this.wordCounter += 1;
    } else {
      this.wordCounter = 0;
      this.finishSprintGame();
    }
  }

  private getRandomIndex(rightIndex: number, idxArr: number[], generatedArray: number[]): number {
    const item: number = generatedArray[Math.floor(Math.random() * generatedArray.length)];
    if (idxArr.includes(item)) {
      return this.getRandomIndex(rightIndex, idxArr, generatedArray);
    }
    return item;
  }

  // Fisher-Yates Algorithm
  public shuffle(array: number[]): number[] {
    const copyArray = array.slice();
    for (let index = array.length - 1; index > 0; index -= 1) {
      const j = Math.floor(Math.random() * (index + 1));
      [copyArray[index], copyArray[j]] = [copyArray[j], copyArray[index]];
    }
    return copyArray;
  }

  public generateArray(length: number): number[] {
    return Array(length - 1)
      .fill(0)
      .map((_, i) => i + 1);
  }

  private async checkIfLearned(userId: string, words: Word[]): Promise<Word[]> {
    const results = await Promise.all(
      words.map((word) => {
        const wordCheck = this.api.isWordLearned(userId, word.id);
        return wordCheck;
      }),
    );
    const filteredWords = words.filter((_word, index) => !results[index].userLearnedWordsExists);
    return filteredWords;
  }

  private checkAnswer(russian: string): ICheckAnswer {
    const audioBtn: HTMLButtonElement = document.querySelector('.audio-call-button');
    const english: string = audioBtn.getAttribute('data-word');
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

  private checkCategory(): void {
    if (this.categoryCounter === 4) {
      this.category += 10;
      this.categoryCounter = 0;
    }
  }

  rightAction(): void {
    this.rightSound.play();
    this.rightSound.currentTime = 0;
    this.categoryCounter += 1;
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
    this.rowCounter = 0;
    this.getMistakes();
  }

  private getMistakes(): void {
    const audioBtn: HTMLButtonElement = document.querySelector('.audio-call-button');
    const english: string = audioBtn.getAttribute('data-word');
    this.words.forEach((word) => {
      if (english === word.word) {
        this.mistakes.push(word);
      }
    });
  }

  private getCorrect(): void {
    const audioBtn: HTMLButtonElement = document.querySelector('.audio-call-button');
    const english: string = audioBtn.getAttribute('data-word');
    this.words.forEach((word) => {
      if (english === word.word) {
        this.correct.push(word);
      }
    });
  }

  private finishSprintGame(): void {
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

  private listenNewGameBtn(): void {
    const newGameBtn = document.querySelector('.btn__new-game');
    newGameBtn.addEventListener('click', (): void => {
      const newGame = new AudioCallControllers();
      newGame.startAudioCallRandom();
    });
  }

  // eslint-disable-next-line max-len
  private async checkWordsPage(group: string, page: string, words: Word[], userId?: string): Promise<Word[]> {
    let allWords: Word[];
    if (Number(page) > 0) {
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
}
