import Footer from '../views/Footer';
import MainPage from '../views/MainPage';

export default class ResultsControllers {
  mainPage: MainPage;

  footer: Footer;

  constructor() {
    this.mainPage = new MainPage();
    this.footer = new Footer();
  }

  listenHomeBtn(): void {
    const homeBtn = document.querySelector('.btn__home');
    const main = document.querySelector('main');
    homeBtn.addEventListener('click', () => {
      main.innerHTML = '';
      this.mainPage.renderMainPage();
      this.footer.renderFooter();
    });
  }

  listenAudioBtn(): void {
    document.body.addEventListener('click', (event: MouseEvent) => {
      const audioBtn: HTMLElement = event.target as HTMLElement;
      if (audioBtn.classList.contains('item__listen-ico')) {
        const audioContainer: HTMLElement = audioBtn.closest('.item__listen');
        const audio: HTMLAudioElement = audioContainer.querySelector('audio');
        audio.play();
      }
    });
  }
}
