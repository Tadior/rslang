export default class Footer {
  createFooter() {
    const footer = document.createElement('footer');
    footer.classList.add('footer');
    footer.innerHTML = `
    <div class="container">
        <div class="footer__wrapper">
            <div class="logo">
            <a href="" class="logo__link">
                <img src="assets/img/main-page/logo.svg" alt="RSLang">
                RSLang
            </a>
            </div>
            <div class="rs-logo">
                <a href="https://rs.school/" class="rs-logo__link">
                    <img src="assets/img/main-page/rs-school-logo.svg" alt="RS school">
                </a>
            </div>
            <div class="github">
                <a href="https://github.com/tadior" class="github__link">
                    <img src="assets/img/main-page/github.svg" alt="github Дмитрий">
                    <div class="github__name">
                        @tadior
                    </div>
                </a>
                <a href="https://github.com/ivanpratasevich" class="github__link">
                    <img src="assets/img/main-page/github.svg" alt="github Ивана">
                    <div class="github__name">
                        @ivanpratasevich
                    </div>
                </a>
                <a href="https://github.com/ilonmakh" class="github__link">
                    <img src="assets/img/main-page/github.svg" alt="github Илоны">
                    <div class="github__name">
                        @ilonmakh
                    </div>
                </a>
            </div>
        </div>
    </div>
    `;
    document.querySelector('main').append(footer);
  }
}
