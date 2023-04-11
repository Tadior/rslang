import logoImage from '../../assets/img/header/logo.svg';
import RSLogoImage from '../../assets/img/footer/rs-school-logo.svg';
import githubImage from '../../assets/img/footer/github.svg';

export default class Footer {
  public renderFooter() {
    const footer = document.createElement('footer');
    footer.classList.add('footer');
    const githubNames: string[] = ['tadior', 'ivanpratasevich', 'ilonmakh'];
    footer.innerHTML = `
    <div class="container">
        <div class="footer__wrapper">
            <div class="logo">
            <a href="" class="logo__link">
                <img src="${logoImage}" class="logo__img" alt="RSLang">
                RSLang
            </a>
            </div>
            <div class="rs-logo">
                <a target="_blank" href="https://rs.school/" class="rs-logo__link">
                    <img src="${RSLogoImage}" alt="RS school">
                </a>
            </div>
            <div class="github">
            ${githubNames.map((name) => `
                <a href="https://github.com/${name}" target="_blank" class="github__link">
                    <img src="${githubImage}" alt="github ${name}">
                    <div class="github__name">
                        @${name}
                    </div>
                </a>`).join('')}
            </div>
        </div>
    </div>
    <div class="rs-year">2022</div>
    `;
    document.querySelector('.wrapper').append(footer);
  }
}
