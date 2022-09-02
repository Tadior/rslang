import Footer from '../views/Footer';
import MainPage from '../views/MainPage';
import SprintControllers from './SprintControllers';

export default class GameMenuControllers {
  sprintControllers: SprintControllers;

  mainPage: MainPage;

  footer: Footer;

  group: string;

  constructor() {
    this.sprintControllers = new SprintControllers();
    this.mainPage = new MainPage();
    this.footer = new Footer();
    this.group = '0';
  }

  listenGameMenu() {
    this.listenCancelBtn();
    this.listenLevelsBtns();
    this.listenStartBtn();
  }

  listenCancelBtn() {
    const cancelBtn = document.querySelector('.btn_cancel');
    cancelBtn.addEventListener('click', () => {
      document.querySelector('main').innerHTML = '';
      this.mainPage.renderMainPage();
      this.footer.renderFooter();
    });
  }

  listenStartBtn() {
    const cancelBtn = document.querySelector('.btn_start');
    const gameTitle = document.querySelector('.title_corner');
    cancelBtn.addEventListener('click', () => {
      document.querySelector('main').innerHTML = '';
      if (gameTitle.innerHTML === 'Спринт') {
        this.sprintControllers.startSprintMenu(this.group);
      } else {
        console.log('start audiocall');
      }
    });
  }

  listenLevelsBtns() {
    const levels = document.querySelector('.difficulty__levels');
    const startBtn: HTMLButtonElement = document.querySelector('.btn_start');
    levels.addEventListener('click', (event: Event) => {
      const target: HTMLElement = event.target as HTMLElement;
      if (target.classList.contains('difficulty__level')) {
        this.group = target.getAttribute('data-group');
        const prevActive = document.querySelector('.active');
        if (prevActive) {
          prevActive.classList.remove('active');
        }
        target.classList.add('active');
        startBtn.disabled = false;
      }
    });
  }
}
