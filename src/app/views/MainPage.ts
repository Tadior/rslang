import exerciseImage from '../../assets/img/main-page/wood.png';
import sprintImage from '../../assets/img/main-page/gamepad.png';
import audioImage from '../../assets/img/main-page/audio.png';
import statisticImage from '../../assets/img/main-page/interface.png';
import bookImage from '../../assets/img/main-page/book.png';
import alarmImage from '../../assets/img/main-page/alarm.png';
import gameEducationImage from '../../assets/img/main-page/game-education.png';
import moneyImage from '../../assets/img/main-page/money.png';
import aboutAppImage from '../../assets/img/main-page/about-app.png';
import IlonaImage from '../../assets/img/main-page/ilona.png';
import DmitryImage from '../../assets/img/main-page/dmitriy.png';
import IvanImage from '../../assets/img/main-page/ivan.png';

export default class MainPage {
  mainControllers: any;

  renderMainPage: () => void;

  constructor(controllers: any) {
    this.mainControllers = controllers;
    this.renderMainPage = () => {
      document.querySelector('main').append(
        this.createProjectSection(),
        this.createAdvantagesSection(),
        this.createAboutAppSection(),
        this.createDevelopersSection(),
      );
      this.mainControllers.listenMain();
    };
  }

  private createProjectSection() {
    function createButton(
      class_identificator: string,
      path: string,
      category_name: string,
      class_hoverIdentificator:string,
    ) {
      const button = document.createElement('button');
      button.classList.add('category', class_identificator);
      button.innerHTML = `
          <img class="category__img" src="${path}" alt=${category_name}">
          <div class="pad ${class_hoverIdentificator}">${category_name}</div>
        `;
      return button;
    }

    const projectSection = document.createElement('section');
    const container = document.createElement('div');
    container.classList.add('container');
    const projectWrapper = document.createElement('div');
    projectWrapper.classList.add('project__wrapper');
    projectSection.classList.add('project');
    const projectButtons = document.createElement('div');
    projectButtons.classList.add('project-categories');
    const projectInfo = document.createElement('div');
    projectInfo.classList.add('project-info');
    projectInfo.innerHTML = `
      <h1>RSLang</h1>
      <p class='paragraph project__paragraph'>RSLang - это бесплатное приложение для изучения английского языка. Его можно использовать как самостоятельный инструмент пополнения лексики и повторения грамматики, так и в качестве дополнительного элемента, который поможет сделать ваше обучение на курсах английского или у репетитора ещё более эффективным.</p>
      `;
    const buttons = [
      createButton('category_exercise', exerciseImage, 'Учебник', 'pad_exercise'),
      createButton('category_sprint', sprintImage, 'Спринт', 'pad_sprint'),
      createButton('category_audio', audioImage, 'Аудиовызов', 'pad_audio'),
      createButton('category_statistic', statisticImage, 'Статистика', 'pad_statistic'),
    ];
    buttons.forEach((button) => {
      projectButtons.append(button);
    });
    const startLearnButton = document.createElement('button');
    startLearnButton.classList.add('btn', 'project__btn');
    startLearnButton.textContent = 'Начать обучение';
    projectInfo.append(startLearnButton);
    projectWrapper.append(projectInfo, projectButtons);
    container.append(projectWrapper);
    projectSection.append(container);
    return projectSection;
  }

  private createAdvantagesSection() {
    const advantagesSection = document.createElement('section');
    advantagesSection.classList.add('advantages');
    advantagesSection.innerHTML = `
    <div class="container">
        <h2 class="title title_advantages">
            Почему стоит выбрать RSLang?
        </h2>
        <div class="advantages__items">
            <div class="advantages__item">
                <div class="advantages__text">
                    Только самый необходимый материал
                </div>
                <img src="${bookImage}" alt="Учебник" class="advantages__img advantages__img_book">
            </div>
            <div class="advantages__item">
                <div class="advantages__text">
                    Достаточно 15 минут в день
                </div>
                <img src="${alarmImage}" alt="Время" class="advantages__img advantages__img_alarm">
            </div>
            <div class="advantages__item">
                <div class="advantages__text">
                    Интерактивное обучение в игровой форме
                </div>
                <img src="${gameEducationImage}" alt="Интерактивное обучение" class="advantages__img advantages__img_game-education">
            </div>
            <div class="advantages__item">
                <div class="advantages__text">
                    Бесплатный доступ
                </div>
                <img src="${moneyImage}" alt="Бесплатный доступ" class="advantages__img advantages__img_money">
            </div>
        </div>
    </div>
    `;
    return advantagesSection;
  }

  private createAboutAppSection() {
    const aboutAppSection = document.createElement('section');
    aboutAppSection.classList.add('about-app');
    aboutAppSection.id = 'about-app';
    aboutAppSection.innerHTML = `
    <div class="container">
        <h2 class="title title_about-app">
            О приложении
        </h2>
        <div class="about-app__wrapper">
            <div class="about-app__content">
                <h3 class="headline">
                Подробнее о приложении
                <br>
                <span class="text-filled">смотри в видео</span>
                </h3>
                </h3>
                <p class="paragraph about-app__paragraph">
                В видео ты cможешь узнать о том, как использовать RSLang, а также об основных возможностях и функционале приложения.
                </p>
                <div class="about-app__link-container">
                <a target='_blank' href="https://www.youtube.com/watch?v=wYIUHQOWCCA" class="btn btn_about">
                    Смотреть
                </a>
                </div>
            </div>
            <div class="about-app__video">
                <img src="${aboutAppImage}" alt="О приложении" class="about-app__img">
            </div>
        </div>
    </div>
    `;
    return aboutAppSection;
  }

  private createDevelopersSection() {
    const developersSection = document.createElement('section');
    developersSection.classList.add('developers');
    developersSection.id = 'developers';
    developersSection.innerHTML = `
    <div class="container">
        <h2 class="title title_developers">
            Команда разработчиков 
        </h2>
        <div class="developers__wrapper">
            <div class="developer">
                <div class="developer__name">
                Илона
                </div>
                <img class="developer__img" src="${IlonaImage}" alt="Илона">
                <div class="developer__status">
                Scrum-мастер, разработчик
                </div>
                <p class="paragraph developer__paragraph">
                Разработка дизайна приложения. Реализация мини-игры "Спринт" и страницы статистики. 
                </p>
                <div class="developer__link-container">
                <a target="_blank" href="https://github.com/ilonmakh" class="btn btn_bordered">
                    GitHub
                </a>
                </div>
            </div>
            <div class="developer">
                <div class="developer__name">
                Дмитрий
                </div>
                <img class="developer__img" src="${DmitryImage}" alt="Дмитрий">
                <div class="developer__status">
                Team-lead, разработчик
                </div>
                <p class="paragraph developer__paragraph">
                Разработка архитектуры приложения. Реализация карточек, учебника, раздела сложные слова. 
                </p>
                <div class="developer__link-container">
                <a target="_blank" href="https://github.com/tadior" class="btn btn_bordered">
                    GitHub
                </a>
                </div>
            </div>
            <div class="developer">
                <div class="developer__name">
                Иван
                </div>
                <img class="developer__img" src="${IvanImage}" alt="Иван">
                <div class="developer__status">
                Fullstack-разработчик
                </div>
                <p class="paragraph developer__paragraph">
                Разработка backend'а приложения. Реализация мини-игры "Аудиовызов" и авторизации. 
                </p>
                <div class="developer__link-container">
                <a target="_blank" href="https://github.com/ivanpratasevich" class="btn btn_bordered">
                    GitHub
                </a>
                </div>
            </div>
        </div>
    </div>
    `;
    return developersSection;
  }
}
