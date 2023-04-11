import Header from './views/Header';
import Footer from './views/Footer';
import AuthorizationControllers from './controllers/AuthorizationControllers';
import MainPage from './views/MainPage';
import MainControllers from './controllers/MainControllers';
import Tutorial from './views/Tutorial';
import Pagination from './views/Pagination';
import GameMenuControllers from './controllers/GameMenuControllers';

export default class App {
  header: Header;

  authorization: AuthorizationControllers;

  mainPage: MainPage;

  footer: Footer;

  mainControllers: MainControllers;

  tutorial: Tutorial;

  pagination: Pagination;

  gameMenu: GameMenuControllers;

  constructor() {
    this.pagination = new Pagination();
    this.gameMenu = new GameMenuControllers();
    this.tutorial = new Tutorial(this.pagination);
    this.header = new Header();
    this.authorization = new AuthorizationControllers();
    this.mainControllers = new MainControllers(this.tutorial, this.gameMenu);
    this.mainPage = new MainPage(this.mainControllers);
    this.footer = new Footer();
  }

  start() {
    this.header.renderHeader();
    this.authorization.enableAuthorization();
    this.mainPage.renderMainPage();
    this.footer.renderFooter();
  }
}
