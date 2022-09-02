import MainPage from '../views/MainPage';
import Tutorial from '../views/Tutorial';
import StatisticPage from '../views/statistics';
import AuthorizationControllers from './AuthorizationControllers';
import { User } from '../../types/types';
import Footer from '../views/Footer';

export default class HeaderControllers {
  mainPage: MainPage;

  book: Tutorial;

  statistic: StatisticPage;

  authorization: AuthorizationControllers;

  userInfo: User;

  footer: Footer;

  constructor() {
    this.mainPage = new MainPage();
    this.book = new Tutorial();
    this.statistic = new StatisticPage();
    this.authorization = new AuthorizationControllers();
    this.footer = new Footer();
  }

  public listenHeader(): void {
    this.listenLogo();
    this.listenAbout();
    this.listenDevelopers();
    this.listenBook();
    this.listenStatistic();
  }

  private listenLogo(): void {
    const headerLogo = document.querySelector('.logo_header');
    headerLogo.addEventListener('click', () => {
      if (!document.querySelector('.project')) {
        document.querySelector('main').innerHTML = '';
        this.mainPage.renderMainPage();
        if (!document.querySelector('footer')) {
          this.footer.renderFooter();
        }
      }
    });
  }

  private listenAbout(): void {
    const aboutLink = document.querySelector('.nav_about');
    aboutLink.addEventListener('click', () => {
      if (!document.querySelector('.project')) {
        document.querySelector('main').innerHTML = '';
        this.mainPage.renderMainPage();
        if (!document.querySelector('footer')) {
          this.footer.renderFooter();
        }
      }
    });
  }

  private listenDevelopers(): void {
    const developersLink = document.querySelector('.nav_developers');
    developersLink.addEventListener('click', () => {
      if (!document.querySelector('.project')) {
        document.querySelector('main').innerHTML = '';
        this.mainPage.renderMainPage();
        if (!document.querySelector('footer')) {
          this.footer.renderFooter();
        }
      }
    });
  }

  private listenBook(): void {
    const bookLink = document.querySelector('.nav_book');
    bookLink.addEventListener('click', () => {
      if (!document.querySelector('.tutorial')) {
        document.querySelector('main').innerHTML = '';
        this.book.renderTutorialPage();
        if (!document.querySelector('footer')) {
          this.footer.renderFooter();
        }
      }
    });
  }

  private listenStatistic(): void {
    const statisticLink = document.querySelector('.nav_statistic');
    statisticLink.addEventListener('click', () => {
      this.userInfo = this.authorization.getUserFromLocalStorage();
      if (!document.querySelector('.statistic')) {
        document.querySelector('main').innerHTML = '';
        if (this.userInfo) {
          this.statistic.renderStatistic();
        } else {
          this.statistic.renderNoStatistic();
        }
        if (!document.querySelector('footer')) {
          this.footer.renderFooter();
        }
      }
    });
  }
}
