import Footer from '../views/Footer';
import MainPage from '../views/MainPage';
import Pagination from '../views/Pagination';
import Tutorial from '../views/Tutorial';
import AudioCallControllers from './AudioCallControllers';
import MainControllers from './MainControllers';
import SprintControllers from './SprintControllers';

export default class GameMenuControllers {
  sprintControllers: SprintControllers;

  audioControllers: AudioCallControllers;

  mainPage: MainPage;

  footer: Footer;

  group: string;

  menu: GameMenuControllers;

  mainControllers: MainControllers;

  listenGameMenu: () => void;

  tutorial: Tutorial;

  pagination: Pagination;

  constructor() {
    this.sprintControllers = new SprintControllers();
    this.audioControllers = new AudioCallControllers();
    this.pagination = new Pagination();
    this.tutorial = new Tutorial(this.pagination);
    this.mainControllers = new MainControllers(this.tutorial, this);
    this.mainPage = new MainPage(this.mainControllers);
    this.footer = new Footer();
    this.group = '0';
    this.listenGameMenu = () => {
      this.listenCancelBtn();
      this.listenLevelsBtns();
      this.listenStartBtn();
    };
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
        this.audioControllers.startAudioCallMenu(this.group);
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
