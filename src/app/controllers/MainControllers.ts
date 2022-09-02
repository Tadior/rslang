import Tutorial from '../views/Tutorial';
import StatisticPage from '../views/statistics';
import AuthorizationControllers from './AuthorizationControllers';
import { User } from '../../types/types';
import Games from '../views/Games';

export default class MainControllers {
  book: Tutorial;

  statistic: StatisticPage;

  authorization: AuthorizationControllers;

  userInfo: User;

  games: Games;

  constructor() {
    this.book = new Tutorial();
    this.statistic = new StatisticPage();
    this.authorization = new AuthorizationControllers();
    this.games = new Games();
  }

  public listenMain(): void {
    this.listenStartLearningBtn();
    this.listenBookBtn();
    this.listenStatisticBtn();
    this.listenAudioCall();
    this.listenSprint();
  }

  private listenStartLearningBtn(): void {
    const startBtn = document.querySelector('.project__btn');
    startBtn.addEventListener('click', () => {
      document.querySelector('main').innerHTML = '';
      this.book.renderTutorialPage();
    });
  }

  private listenBookBtn(): void {
    const bookBtn = document.querySelector('.category_exercise');
    bookBtn.addEventListener('click', () => {
      document.querySelector('main').innerHTML = '';
      this.book.renderTutorialPage();
    });
  }

  listenSprint() {
    const sprintBtn = document.querySelector('.category_sprint');
    sprintBtn.addEventListener('click', () => {
      document.querySelector('main').innerHTML = '';
      this.games.renderDifficultMenu('Спринт');
      if (document.querySelector('footer')) {
        const footer = document.querySelector('footer');
        footer.parentNode.removeChild(footer);
      }
    });
  }

  listenAudioCall() {
    const audioBtn = document.querySelector('.category_audio');
    audioBtn.addEventListener('click', () => {
      document.querySelector('main').innerHTML = '';
      this.games.renderDifficultMenu('Аудиовызов');
      if (document.querySelector('footer')) {
        const footer = document.querySelector('footer');
        footer.parentNode.removeChild(footer);
      }
    });
  }

  private listenStatisticBtn(): void {
    const statisticBtn = document.querySelector('.category_statistic');
    statisticBtn.addEventListener('click', () => {
      this.userInfo = this.authorization.getUserFromLocalStorage();
      document.querySelector('main').innerHTML = '';
      if (this.userInfo) {
        this.statistic.renderStatistic();
      } else {
        this.statistic.renderNoStatistic();
      }
    });
  }
}
