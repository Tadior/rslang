import Footer from '../views/Footer';
import MainPage from '../views/MainPage';
import SprintControllers from './SprintControllers';

export default class GameMenuControllers {
  sprintControllers: SprintControllers;

  mainPage: MainPage;
  
  footer: Footer;

  constructor() {
    this.sprintControllers = new SprintControllers();
    this.mainPage = new MainPage();
    this.footer = new Footer();
  }

  listenGameMenu() {
    this.listenCancelBtn();
  }

  listenCancelBtn() {
    const cancelBtn = document.querySelector('.btn_cancel');
    cancelBtn.addEventListener('click', () => {
      document.querySelector('main').innerHTML = '';
      this.mainPage.renderMainPage();
      this.footer.renderFooter();
    });
  }
}
