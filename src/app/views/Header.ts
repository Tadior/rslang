import logoImage from '../../assets/img/header/logo.svg';
import AuthorizationControllers from '../controllers/AuthorizationControllers';
import HeaderControllers from '../controllers/HeaderControllers';

export default class Header {
  authorization: AuthorizationControllers;

  headerControllers: HeaderControllers;

  constructor() {
    this.authorization = new AuthorizationControllers();
    this.headerControllers = new HeaderControllers();
  }

  public renderHeader() {
    const header = document.createElement('header');
    header.classList.add('header');
    const container = document.createElement('div');
    container.classList.add('container');
    const headerWrapper = document.createElement('div');
    headerWrapper.classList.add('header__wrapper');
    const logo = `
    <div class="logo logo_header">
        <a href="#" class="logo__link">
            <img class="logo__img" src="${logoImage}" alt="RSLang">
            RSLang
        </a>
    </div>
    `;
    const navigation = document.createElement('nav');
    navigation.classList.add('navigation');
    const navigationContainer = `
    <ul class="navigation__container">
        <li class="navigation__item nav_about">
            <a href="#about-app" class="navigation__link">
                О приложении
            </a>
        </li>
        <li class="navigation__item nav_developers">
            <a href="#developers" class="navigation__link">
                Команда
            </a>
        </li>
        <li class="navigation__item nav_book">
            <a href="#" class="navigation__link">
                Учебник
            </a>
        </li>
        <li class="navigation__item nav_statistic">
            <a href="#" class="navigation__link">
                Статистика
            </a>
        </li>
    </ul>
    `;
    navigation.innerHTML = navigationContainer;
    const authorisationBtn = document.createElement('button');
    const logoutBtn = document.createElement('button');
    if (this.authorization.checkUserInLocalStorage()) {
      authorisationBtn.classList.add('btn', 'btn_login', 'btn_bordered', 'btn_navigation', 'btn_hide');
      logoutBtn.classList.add('btn', 'btn_logout', 'btn_bordered');
    } else {
      authorisationBtn.classList.add('btn', 'btn_login', 'btn_bordered', 'btn_navigation');
      logoutBtn.classList.add('btn', 'btn_logout', 'btn_bordered', 'btn_hide');
    }
    authorisationBtn.textContent = 'Войти';
    logoutBtn.textContent = 'Выйти';
    const burger = document.createElement('button');
    burger.classList.add('burger');
    burger.innerHTML = '<span class="burger__line"></span>';
    burger.addEventListener('click', () => {
      this.toggleBurger();
    });
    navigation.append(authorisationBtn, logoutBtn);
    headerWrapper.innerHTML = `${logo}`;
    headerWrapper.append(navigation, burger);
    container.append(headerWrapper);
    header.append(container);
    document.querySelector('.wrapper').prepend(header);

    this.headerControllers.listenHeader();
  }

  private toggleBurger(): void {
    const burger = document.querySelector('.burger');
    burger.classList.toggle('burger_active');
    this.toggleNavigation();
    document.querySelector('body').classList.toggle('scroll_blocked');
    this.listenNavigation();
  }

  private toggleNavigation(): void {
    const navigation = document.querySelector('.navigation');
    navigation.classList.toggle('navigation_active');
  }

  private listenNavigation() {
    const navigation = document.querySelector('.navigation__container');
    navigation.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('navigation__link')) {
        this.toggleBurger();
      }
    });
  }
}
