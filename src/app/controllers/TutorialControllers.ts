import Api from '../models/Api';
import Card from '../views/Card';

export default class TutorialControllers {
  addListenners() {
    const tutorialNavigation = document.querySelector('.tutorial__navigation');
    tutorialNavigation.addEventListener('click', (event) => {
      const eventInfo = {
        target: event.target as HTMLElement,
      };
      if (eventInfo.target.hasAttribute('data-group')) {
        const group = eventInfo.target.getAttribute('data-group');
        this.changeCategory(group, eventInfo.target);
      }
    });
  }

  changeCategory(group: string, target: HTMLElement): void | boolean {
    console.log(group);
    const prevNavActive = document.querySelector('.tutorial__link_active');
    if (prevNavActive) {
      prevNavActive.classList.remove('tutorial__link_active');
    }
    const prevTabActive = document.querySelector('.tabs__block_active');
    prevTabActive.classList.remove('tabs__block_active');
    target.classList.add('tutorial__link_active');
    const tabActive = document.getElementById(`${group}`);
    console.log(tabActive);
    tabActive.classList.add('tabs__block_active');
    // Если на предыдущей странице есть карточки то не добавлять новые
    const categoryWrapper = document.getElementById(`${group}`);

    if (categoryWrapper.querySelector('.card')) {
      console.log('НЕ добавлять карточки');
      return false;
    }
    // Если открыт словарь
    if (group === 'myVocabulary') {
      console.log('Словарь');
      return false;
    }
    //---------------------------------------
    const groupValue = group.toString();
    this.renderCards(`${groupValue[groupValue.length - 1]}`, categoryWrapper);
    return true;
  }

  renderCards(group: string, renderContainer: HTMLElement) {
    const api = new Api();
    const response = api.getWords(group, '0');
    response.then((data) => {
      for (let i = 0; i < data.length; i += 1) {
        const card = new Card(data[i]);
        card.renderCard(renderContainer);
      }
    });
  }
}
