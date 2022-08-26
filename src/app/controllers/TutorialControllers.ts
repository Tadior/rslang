import { Word } from '../../types/types';
import Api from '../models/Api';
import Card from '../views/Card';
import soundImage from '../../assets/img/icons/sound.svg';
import url from '../models/variables';

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
        this.createPagination(30, 1);
      }
    });
    const paginationWrapper = document.querySelector('.pagination');
    paginationWrapper.addEventListener('click', (event): boolean => {
      const eventInfo = {
        target: event.target as HTMLElement,
      };
      let page = 0;
      if (eventInfo.target.classList.contains('pagination__btn_prev')) {
        page = Number(document.querySelector('.pagination__btn_active').textContent);
        page -= 1;
        this.createPagination(30, page);
      } else if (eventInfo.target.classList.contains('pagination__btn_next')) {
        page = Number(document.querySelector('.pagination__btn_active').textContent);
        page += 1;
        this.createPagination(30, page);
      } else if (eventInfo.target.classList.contains('pagination__btn')) {
        page = Number(eventInfo.target.textContent);
        this.createPagination(30, page);
      }

      const currentGroup = document.querySelector('.tutorial__link_active').getAttribute('data-group');
      const api = new Api();
      // Отнимаем единицу так как считаем страницы от 0 до 29
      page -= 1;
      if (page < 0) {
        return false;
      }
      const response = api.getWords(currentGroup, page.toString());
      response.then((data) => {
        this.updateCards(data);
      });
      return true;
    });
  }

  changeCategory(group: string, target: HTMLElement): void | boolean {
    const prevNavActive = document.querySelector('.tutorial__link_active');
    if (prevNavActive) {
      prevNavActive.classList.remove('tutorial__link_active');
    }
    const prevTabActive = document.querySelector('.tabs__block_active');
    prevTabActive.classList.remove('tabs__block_active');
    target.classList.add('tutorial__link_active');
    const tabActive = document.getElementById(`tab_${group}`);
    tabActive.classList.add('tabs__block_active');
    // Если на странице есть карточки то не добавлять новые
    const categoryWrapper = document.getElementById(`tab_${group}`);

    if (categoryWrapper.querySelector('.card')) {
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

  createPagination(totalPages: number, page: number) {
    let pagination = '';
    let active = '';
    let beforePage = page - 1;
    let afterPage = page + 1;

    if (page === 0 || page === totalPages + 1) {
      return false;
    }
    // Если страница больше 1 то делаем кнопку юзабельной
    if (page === 1) {
      pagination += '<button class="pagination__btn pagination__btn_prev pagination__btn_disabled ">Prev</button>';
    } else if (page > 1) {
      pagination += '<button class="pagination__btn pagination__btn_prev">Prev</button>';
    }
    // Если страница больше 2 то добавляем первую страницу
    if (page > 2) {
      pagination += '<button class="pagination__btn">1</button>';
      // Если страница больше 3 то добавляем точки
      if (page > 3) {
        pagination += '<div class="pagination__points">...</div>';
      }
    }
    // Сколько страниц отображается до текущей
    if (page === totalPages) {
      beforePage -= 2;
    } else if (page === totalPages - 1) {
      beforePage -= 1;
    }
    // Сколько страниц отображается после текущей
    if (page === 1) {
      afterPage += 2;
    } else if (page === 2) {
      afterPage += 1;
    }
    // Создаем соседние кнопки
    for (let plength = beforePage; plength <= afterPage; plength += 1) {
      if (plength > totalPages) {
        break;
      }
      if (plength === 0) {
        plength += 1;
      }
      if (page === plength) {
        active = 'pagination__btn_active';
      } else {
        active = '';
      }
      pagination += `<button class="pagination__btn ${active}">${plength}</button>`;
    }
    if (page < totalPages - 1) {
      if (page < totalPages - 2) {
        pagination += '<div class="pagination__points">...</div>';
      }
      pagination += `<button class="pagination__btn">${totalPages}</button>`;
    }
    // Если страница не последняя то делаем кнопку юзабельной
    if (page === totalPages) {
      pagination += '<button class="pagination__btn pagination__btn_next pagination__btn_disabled">Next</button>';
    } else if (page < totalPages) {
      pagination += '<button class="pagination__btn pagination__btn_next">Next</button>';
    }
    document.querySelector('.pagination').innerHTML = pagination;
    return pagination;
  }

  updateCards(data: Word[]) {
    const activeTab = document.querySelector('.tabs__block_active');
    const cardsOnPage = Array.from(activeTab.querySelectorAll('.card'));
    cardsOnPage.map((card, index) => {
      const cardImageContainer = card.querySelector('.card__image-fluid');
      const cardWord = card.querySelector('.card-name__original');
      const cardWordTranslation = card.querySelector('.card-name__translation');
      const cardWordTranscription = card.querySelector('.card-transcription');
      const cardDefenitionContainer = card.querySelector('.card-sentence_example');
      const cardMeaningContainer = card.querySelector('.card-sentence_meaning');
      const cardDefenitionEnglish = cardDefenitionContainer.querySelector('.card-sentence__original');
      const cardDefenitionRussian = cardDefenitionContainer.querySelector('.card-sentence__translate');
      const cardMeaningEnglish = cardMeaningContainer.querySelector('.card-sentence__original');
      const cardMeaningRussian = cardMeaningContainer.querySelector('.card-sentence__translate');
      const cardItem = card;
      cardItem.id = data[index].id;
      const cardInfo = card.querySelector('.card__info');
      cardImageContainer.innerHTML = `
        <img class="card__img" src="${url}${data[index].image}"
        alt="Картинка для слова ${data[index].word}">
      `;
      cardWord.innerHTML = `
        ${data[index].word}
      `;
      cardWordTranslation.innerHTML = `
        ${data[index].wordTranslate}
      `;
      cardWordTranscription.innerHTML = `
        ${data[index].transcription}
      `;
      cardDefenitionEnglish.innerHTML = `
        ${data[index].textExample}
      `;
      cardDefenitionRussian.innerHTML = `
        ${data[index].textExampleTranslate}
      `;
      cardMeaningEnglish.innerHTML = `
        ${data[index].textMeaning}
      `;
      cardMeaningRussian.innerHTML = `
        ${data[index].textMeaningTranslate}
      `;
      card.querySelector('.card-btn__audio').remove();
      const cardAudio = document.createElement('button');
      cardAudio.classList.add('card-btn__audio');
      cardAudio.innerHTML = `<img src="${soundImage}" alt="Произнести слово ${data[index].word}">`;
      cardInfo.append(cardAudio);
      cardAudio.addEventListener('click', () => {
        this.playAudio(
          data[index].audio,
          data[index].audioExample,
          data[index].audioMeaning,
        );
      });
      return card;
    });
  }

  private playAudio(wordPath: string, wordMeaningPath: string, wordExamplePath: string) {
    const audioWord = new Audio(url + wordPath);
    audioWord.addEventListener('ended', () => {
      const audioMeaning = new Audio(url + wordMeaningPath);
      audioMeaning.play();
      audioMeaning.addEventListener('ended', () => {
        const audioExample = new Audio(url + wordExamplePath);
        audioExample.play();
      });
    });
    audioWord.play();
  }
}
