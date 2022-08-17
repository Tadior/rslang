export default class MainPage {
  createMainPage() {
    document.querySelector('main').append(this.createProjectSection(), this.createAdvantagesSection(), this.createAboutAppSection(), this.createDevelopersSection());
  }

  private createProjectSection() {
    // Создание секции Project
    const projectSection = document.createElement('div');
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
        <p class='paragraph project__paragraph'>RSLang - это бесплатное приложение для изучения английского языка.Приложения можно использовать как самостоятельный инструмент пополнения лексики и повторения грамматики, так и в качестве дополнительного элемента, который поможет сделать ваше обучение на курсах английского или у репетитора ещё более эффективным.</p>`;
    // Функция создания кнопок навигации
    function createButton(class_identificator: string, img_file_name: string, img_alt: string) {
      const button = document.createElement('button');
      button.classList.add('category', class_identificator);
      button.innerHTML = `
        <img class="cetegory__img" src="./assets/img/main-page/${img_file_name}" alt=${img_alt}">
        <div class="pad pad_exercise">Учебник</div>
      `;
      button.addEventListener('click', () => {
        console.log('Тут должно быть переключение страницы');
      });
      return button;
    }
    //------------------------------------------
    const buttons = [
      createButton('category_exercise', 'wood.png', 'Учебник'),
      createButton('category_sprint', 'gamepad.png', 'Спринт'),
      createButton('category_audio', 'audio.png', 'Аудиовызов'),
      createButton('category_statistic', 'interface.png', 'Статистика'),
    ];
    buttons.forEach((button) => {
      projectButtons.append(button);
    });
    const projectCategories = document.createElement('div'); projectCategories.classList.add('project-categories');
    const startLearnButton = document.createElement('button');
    startLearnButton.classList.add('btn', 'project__btn');
    startLearnButton.textContent = 'Начать обучение';
    startLearnButton.addEventListener('click', () => {
      console.log('Что то должно происходить');
    });
    projectInfo.append(startLearnButton);
    projectCategories.append(projectButtons);
    projectWrapper.append(projectInfo, projectCategories);
    container.append(projectWrapper);
    projectSection.append(container);
    return projectSection;
  }

  private createAdvantagesSection() {
    // Создание секции advantages
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
                <img src="assets/img/main-page/book.png" alt="Учебник" class="advantages__img advantages__img_book">
            </div>
            <div class="advantages__item">
                <div class="advantages__text">
                    Достаточно 15 минут в день
                </div>
                <img src="assets/img/main-page/alarm.png" alt="Время" class="advantages__img advantages__img_alarm">
            </div>
            <div class="advantages__item">
                <div class="advantages__text">
                    Интерактивное обучение в игровой форме
                </div>
                <img src="assets/img/main-page/game-education.png" alt="Интерактивное обучение" class="advantages__img advantages__img_game-education">
            </div>
            <div class="advantages__item">
                <div class="advantages__text">
                    Бесплатный доступ
                </div>
                <img src="assets/img/main-page/money.png" alt="Бесплатный доступ" class="advantages__img advantages__img_money">
            </div>
        </div>
    </div>
    `;
    return advantagesSection;
  }

  private createAboutAppSection() {
    // Создание секции about-app
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
                <a target='_blank' href="https://www.youtube.com/" class="btn btn_about">
                    Смотреть
                </a>
                </div>
            </div>
            <div class="about-app__video">
                <img src="assets/img/main-page/about-app.png" alt="О приложении" class="about-app__img">
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
                <img class="developer__img" src="assets/img/main-page/ilona.png" alt="Илона">
                <div class="developer__status">
                Scrum-мастер, разработчик
                </div>
                <p class="paragraph developer__paragraph">
                Текст о том, какой я молодец и с чем так хорошо справился Текст о том, какой я молодец и с чем так хорошо справился
                </p>
                <div class="developer__link-container">
                <a href="https://github.com/ilonmakh" class="btn btn_bordered">
                    GitHub
                </a>
                </div>
            </div>
            <div class="developer">
                <div class="developer__name">
                Дмитрий
                </div>
                <img class="developer__img" src="assets/img/main-page/dmitriy.png" alt="Дмитрий">
                <div class="developer__status">
                Team-lead, разработчик
                </div>
                <p class="paragraph developer__paragraph">
                Текст о том, какой я молодец и с чем так хорошо справился Текст о том, какой я молодец и с чем так хорошо справился
                </p>
                <div class="developer__link-container">
                <a href="https://github.com/tadior" class="btn btn_bordered">
                    GitHub
                </a>
                </div>
            </div>
            <div class="developer">
                <div class="developer__name">
                Иван
                </div>
                <img class="developer__img" src="assets/img/main-page/ivan.png" alt="Иван">
                <div class="developer__status">
                Разработчик
                </div>
                <p class="paragraph developer__paragraph">
                Текст о том, какой я молодец и с чем так хорошо справился Текст о том, какой я молодец и с чем так хорошо справился
                </p>
                <div class="developer__link-container">
                <a href="https://github.com/ivanpratasevich" class="btn btn_bordered">
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
