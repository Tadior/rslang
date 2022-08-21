import logoImage from '../../assets/img/header/logo.svg';

export default class Header {
  renderHeader() {
    const header = document.createElement('header');
    header.classList.add('header');
    const container = document.createElement('div');
    container.classList.add('container');
    const headerWrapper = document.createElement('div');
    headerWrapper.classList.add('header__wrapper');
    const logo = `
    <div class="logo">
        <a href="" class="logo__link">
            <img class="logo__img" src="${logoImage}" alt="RSLang">
            RSLang
        </a>
    </div>
    `;
    const navigation = `
    <nav class="navigation">
    <ul class="navigation__container">
        <li class="navigation__item">
            <a href="#about-app" class="navigation__link">
                О приложении
            </a>
        </li>
        <li class="navigation__item">
            <a href="#developers" class="navigation__link">
                Команда
            </a>
        </li>
        <li class="navigation__item">
            <a href="#" class="navigation__link">
                Учебник
            </a>
        </li>
        <li class="navigation__item">
            <a href="#" class="navigation__link">
                Статистика
            </a>
        </li>
    </ul>
    </nav>
    `;
    const authorisationBtn = document.createElement('button');
    authorisationBtn.classList.add('btn', 'btn_bordered', 'btn_navigation');
    authorisationBtn.textContent = 'Войти';
    authorisationBtn.addEventListener('click', () => {
      console.log('Открывается меню');
    });
    headerWrapper.innerHTML = `${logo}${navigation}`;
    headerWrapper.append(authorisationBtn);
    container.append(headerWrapper);
    header.append(container);
    document.querySelector('.wrapper').prepend(header);
  }
}
