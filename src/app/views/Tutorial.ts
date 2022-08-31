import audioImage from '../../assets/img/main-page/audio.png';
import gamepadImage from '../../assets/img/main-page/gamepad.png';
import arrowImage from '../../assets/img/icons/arrow.svg';
import Pagination from './Pagination';
import TutorialControllers from '../controllers/TutorialControllers';
import Api from '../models/Api';

export default class Tutorial {
  renderTutorialPage() {
    const tutorialSection = document.createElement('section');
    tutorialSection.classList.add('tutorial');
    tutorialSection.id = 'tutorial';
    const container = document.createElement('div');
    container.classList.add('container');
    const tutorialWrapper = document.createElement('div');
    tutorialWrapper.classList.add('tutorial__wrapper');
    tutorialWrapper.append(
      this.createTutorialNavigation(),
      this.createTutorialBody(),
      this.createArrow(),
    );
    container.append(tutorialWrapper);
    tutorialSection.append(container);
    document.querySelector('.main').append(tutorialSection);
    const pagination = new Pagination();
    pagination.renderPagination();
    const firstTabContainer = document.getElementById('tab_0');
    // При перезагрузке страницы загрузить ту же страницу
    const tutorialControllers = new TutorialControllers();
    const lastNavValue = tutorialControllers.checkStorage('lastNav');
    if (lastNavValue !== -1) {
      document.querySelector('.tutorial__link_active').classList.remove('tutorial__link_active');
      const tutorialLinks = document.querySelectorAll('.tutorial__link');
      let target;
      tutorialLinks.forEach((element) => {
        if (element.getAttribute('data-group') === lastNavValue.toString()) {
          target = element;
        }
      });
      if (lastNavValue === 6) {
        tutorialControllers.renderVocabulary();
      }
      const page = tutorialControllers.checkStorage(lastNavValue.toString());
      tutorialControllers.changeCategory(`${lastNavValue}`, target, `${page - 1}`);
      tutorialControllers.createPagination(30, page);
    } else {
      const api = new Api();
      const response = api.getWords(`${lastNavValue + 1}`, '0');
      response.then((data) => {
        tutorialControllers.renderCards(firstTabContainer, data.length);
        tutorialControllers.updateCards(data).then(() => tutorialControllers.checkPage());
      });
    }
  }

  private createTutorialNavigation(): HTMLDivElement {
    function createLink(
      name:string,
      id: string,
      group: string,
      classModificator: string,
    ): HTMLButtonElement {
      const tutorialLink = document.createElement('button');
      tutorialLink.classList.add('tutorial__link', classModificator);
      if (group === '0') {
        tutorialLink.classList.add('tutorial__link_active');
      }
      tutorialLink.id = `${id}`;
      tutorialLink.dataset.group = group.toString();
      tutorialLink.textContent = name;
      return tutorialLink;
    }
    const tutorialNavigation = document.createElement('div');
    tutorialNavigation.classList.add('tutorial__navigation');
    const tutorialLinks = document.createElement('div');
    tutorialLinks.classList.add('tutorial__links');
    tutorialLinks.append(
      createLink('A1', 'nav_tab_1', '0', 'tutorial_light-blue'),
      createLink('A2', 'nav_tab_1', '1', 'tutorial_pink'),
      createLink('B1', 'nav_tab_1', '2', 'tutorial_yellow'),
      createLink('B2', 'nav_tab_1', '3', 'tutorial_light-purpule'),
      createLink('C1', 'nav_tab_1', '4', 'tutorial_aquamarine'),
      createLink('C2', 'nav_tab_1', '5', 'tutorial_purple'),
    );

    const tutorialGames = document.createElement('div');
    tutorialGames.classList.add('tutorial__games');
    const tutorialGameAudio = document.createElement('button');
    tutorialGameAudio.classList.add('tutorial-game');
    tutorialGameAudio.innerHTML = `
      <img class="tutorial-game__image tutorial-game__image_audio" src="${audioImage}" alt="Аудиовызов">
    `;
    const tutorialGameSprint = document.createElement('button');
    tutorialGameSprint.classList.add('tutorial-game');
    tutorialGameSprint.innerHTML = `
      <img class="tutorial-game__image tutorial-game__image_audio" src="${gamepadImage}" alt="Спринт">
    `;
    const itemsToAppend = [tutorialLinks, tutorialGames];
    localStorage.setItem('userId', '622552a0-0732-41ce-9815-9d173e8b7649');
    // Проверка авторизован ли пользователь
    if (localStorage.getItem('userId')) {
      const tutorialDictionary = document.createElement('div');
      tutorialDictionary.classList.add('tutorial__dictionary');
      tutorialDictionary.append(
        createLink('Мой словарь', 'nav_myVocabulary', '6', 'tutorial_green'),
      );
      itemsToAppend.splice(1, 0, tutorialDictionary);
    }
    tutorialGames.append(tutorialGameAudio, tutorialGameSprint);
    tutorialNavigation.append(
      ...itemsToAppend,
    );
    return tutorialNavigation;
  }

  private createTutorialBody(): HTMLDivElement {
    const tutorialBody = document.createElement('div');
    tutorialBody.classList.add('tutorial__body', 'tabs');
    tutorialBody.append(
      this.createTab('tab_0', 'tutorial_light-blue', true),
      this.createTab('tab_1', 'tutorial_pink'),
      this.createTab('tab_2', 'tutorial_yellow'),
      this.createTab('tab_3', 'tutorial_light-purpule'),
      this.createTab('tab_4', 'tutorial_aquamarine'),
      this.createTab('tab_5', 'tutorial_purple'),
      this.createTab('tab_6', 'tutorial_green'),
    );
    return tutorialBody;
  }

  private createTab(
    id: string,
    classModificator: string,
    isActive: boolean = false,
  ): HTMLDivElement {
    const tab = document.createElement('div');
    tab.classList.add('tabs__block', classModificator);
    if (isActive) {
      tab.classList.add('tabs__block_active');
    }
    if (id === 'tab_6') {
      tab.innerHTML = '<div class="tabs__block_message">В вашем словаре нет слов</div>';
    }
    tab.id = id;
    return tab;
  }

  private createArrow(): HTMLAnchorElement {
    const arrowLink = document.createElement('a');
    arrowLink.classList.add('arrow-link');
    arrowLink.href = '#tutorial';
    arrowLink.innerHTML = `
    <img src='${arrowImage}'>
    `;
    return arrowLink;
  }
}
