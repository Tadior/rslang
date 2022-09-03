import Footer from '../views/Footer';

export default class ResultsControllers {
  footer: Footer;

  constructor() {
    this.footer = new Footer();
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
