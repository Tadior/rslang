import audioImage from '../../assets/img/main-page/audio.png';
import gamepadImage from '../../assets/img/main-page/gamepad.png';

export default class Tutorial {
  renderTutorialPage() {
    const tutorialSection = document.createElement('section');
    tutorialSection.classList.add('tutorial');
    const container = document.createElement('div');
    container.classList.add('container');
    const tutorialWrapper = document.createElement('div');
    tutorialWrapper.classList.add('tutorial__wrapper');
    tutorialWrapper.append(this.createTutorialNavigation(), this.createTutorialBody());
    container.append(tutorialWrapper);
    tutorialSection.append(container);
    console.log(tutorialSection);
    document.querySelector('.main').append(tutorialSection);
  }

  private createTutorialNavigation(): HTMLDivElement {
    function createLink(name:string, id: string, classModificator: string): HTMLAnchorElement {
      const tutorialLink = document.createElement('a');
      tutorialLink.classList.add('tutorial__link', classModificator);
      tutorialLink.href = `#${id}`;
      tutorialLink.textContent = name;
      return tutorialLink;
    }
    const tutorialNavigation = document.createElement('div');
    tutorialNavigation.classList.add('tutorial__navigation');
    const tutorialLinks = document.createElement('div');
    tutorialLinks.classList.add('tutorial__links');
    tutorialLinks.append(
      createLink('A1', 'tab_01', 'tutorial_light-blue'),
      createLink('A2', 'tab_02', 'tutorial_pink'),
      createLink('B1', 'tab_03', 'tutorial_yellow'),
      createLink('B2', 'tab_04', 'tutorial_light-purpule'),
      createLink('C1', 'tab_05', 'tutorial_aquamarine'),
      createLink('C2', 'tab_06', 'tutorial_purple'),
    );

    const tutorialDictionary = document.createElement('div');
    tutorialDictionary.classList.add('tutorial__dictionary');
    tutorialDictionary.append(
      createLink('Мой словарь', 'myVocabulary', 'tutorial_green'),
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
    tutorialGames.append(tutorialGameAudio, tutorialGameSprint);
    tutorialNavigation.append(
      tutorialLinks,
      tutorialDictionary,
      tutorialGames,
    );
    return tutorialNavigation;
  }

  private createTutorialBody(): HTMLDivElement {
    const tutorialBody = document.createElement('div');
    tutorialBody.classList.add('tutorial__body', 'tabs');
    tutorialBody.append(
      this.createTab('tab_01', 'tutorial_light-blue'),
      this.createTab('tab_02', 'tutorial_pink'),
      this.createTab('tab_03', 'tutorial_yellow'),
      this.createTab('tab_04', 'tutorial_light-purpule'),
      this.createTab('tab_05', 'tutorial_aquamarine'),
      this.createTab('tab_06', 'tutorial_purple'),
      this.createTab('myVocabulary', 'tutorial_green'),
    );
    return tutorialBody;
  }

  private createTab(id: string, classModificator: string): HTMLDivElement {
    const tab = document.createElement('div');
    tab.classList.add('tabs__block', classModificator);
    tab.id = id;
    return tab;
  }
}
