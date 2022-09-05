import MainPage from '../views/MainPage';
import Tutorial from '../views/Tutorial';
import StatisticPage from '../views/statistics';
import AuthorizationControllers from './AuthorizationControllers';
import { User } from '../../types/types';
import Footer from '../views/Footer';
import MainControllers from './MainControllers';
import Pagination from '../views/Pagination';
import GameMenuControllers from './GameMenuControllers';

export default class HeaderControllers {
  mainPage: MainPage;

  book: Tutorial;

  authorization: AuthorizationControllers;

  userInfo: User;

  footer: Footer;

  mainControllers: MainControllers;

  pagination: Pagination;

  gameMenu: GameMenuControllers;

  constructor() {
    this.pagination = new Pagination();
    this.book = new Tutorial(this.pagination);
    this.gameMenu = new GameMenuControllers();
    this.mainControllers = new MainControllers(this.book, this.gameMenu);
    this.mainPage = new MainPage(this.mainControllers);
    this.authorization = new AuthorizationControllers();
    this.footer = new Footer();
  }

  public listenHeader(): void {
    this.listenLogo();
    this.listenAbout();
    this.listenDevelopers();
    this.listenBook();
    this.listenStatistic();
    this.listenHomeBtn();
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
      const statistic = new StatisticPage();
      this.userInfo = this.authorization.getUserFromLocalStorage();
      if (!document.querySelector('.statistic')) {
        document.querySelector('main').innerHTML = '';
        if (this.userInfo) {
          statistic.renderStatistic();
        } else {
          statistic.renderNoStatistic();
        }
        if (!document.querySelector('footer')) {
          this.footer.renderFooter();
        }
      }
    });
  }

  private listenHomeBtn(): void {
    document.body.addEventListener('click', (event: Event) => {
      const target: HTMLElement = event.target as HTMLElement;
      if (target.classList.contains('btn__home')) {
        document.querySelector('main').innerHTML = '';
        this.mainPage.renderMainPage();
        if (!document.querySelector('footer')) {
          this.footer.renderFooter();
        }
      }
    });
  }
}
