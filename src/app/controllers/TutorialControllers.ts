import { Word, CheckLearnedWord, UserWord } from '../../types/types';
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
      // Если клик совершен по одной из вкладок
      if (eventInfo.target.hasAttribute('data-group')) {
        const group = eventInfo.target.getAttribute('data-group');
        const prevNav = document.querySelector('.tutorial__link_active');
        const prevNavGroup = prevNav.getAttribute('data-group');
        const prevPaginationValue = document.querySelector('.pagination__btn_active').textContent;
        // Обновляем значение предыдущей категории
        this.updateStorage(prevNavGroup, prevPaginationValue);
        // Обновляем текущую категорию
        this.updateStorage('lastNav', group);
        // Если в local storage есть страница на которой пользователь остановился - загрузить эту страницу
        const localStoragePage = this.checkStorage(group);
        if (localStoragePage !== -1) {
          this.changeCategory(group, eventInfo.target, String(localStoragePage - 1));
          this.createPagination(30, localStoragePage);
          // this.checkPage();
        } else {
          this.updateStorage(group, '1');
          this.changeCategory(group, eventInfo.target, '0');
          this.createPagination(30, 1);
          // this.checkPage();
        }
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
      // Обновляем localStorage при переключении страницы
      this.updateStorage(currentGroup, page.toString());
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

  changeCategory(group: string, target: HTMLElement | string, page: string): void | boolean {
    const prevNavActive = document.querySelector('.tutorial__link_active');
    if (prevNavActive) {
      prevNavActive.classList.remove('tutorial__link_active');
    }
    const prevTabActive = document.querySelector('.tabs__block_active');
    prevTabActive.classList.remove('tabs__block_active');
    if (typeof target === 'string') {
      document.querySelector(target).classList.add('tutorial__link_active');
    } else {
      target.classList.add('tutorial__link_active');
    }
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
    this.renderCards(`${groupValue[groupValue.length - 1]}`, categoryWrapper, page);
    // this.checkPage();
    return true;
  }

  renderCards(group: string, renderContainer: HTMLElement, page: string) {
    const api = new Api();
    const response = api.getWords(group, page);
    // const userId = localStorage.getItem('userID');
    response.then((data) => {
      for (let i = 0; i < data.length; i += 1) {
        // api.checkLearnWord(userId)
        const card = new Card();
        const cardContainer = card.renderCard(renderContainer);
        const hardBtn = cardContainer.querySelector('.btn_add');
        const learnBtn = cardContainer.querySelector('.btn-learned');
        hardBtn.addEventListener('click', (event) => {
          const target = event.target as HTMLElement;
          this.addWordToMyDictionary(target);
        });

        learnBtn.addEventListener('click', (event) => {
          const target = event.target as HTMLElement;
          this.markWordAsLearned(target);
          this.checkPage();
        });
      }
      this.updateCards(data);
    });
  }

  createPagination(totalPages: number, page: number) {
    const activeGroup = document.querySelector('.tutorial__link_active').getAttribute('data-group');
    let learnedPages;
    if (localStorage.getItem('pagination') !== null) {
      learnedPages = JSON.parse(localStorage.getItem('pagination'));
    }
    let pagination = '';
    let active = '';
    let learned = '';
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
      if (learnedPages && learnedPages[activeGroup] && learnedPages[activeGroup].includes('1')) {
        pagination += '<button class="pagination__btn pagination__btn-learned">1</button>';
      } else {
        pagination += '<button class="pagination__btn">1</button>';
      }
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
      if (learnedPages
        && learnedPages[activeGroup]
        && learnedPages[activeGroup].includes(plength.toString())) {
        learned = 'pagination__btn-learned';
      }
      pagination += `<button class="pagination__btn ${active} ${learned}">${plength}</button>`;
      learned = '';
    }
    if (page < totalPages - 1) {
      if (page < totalPages - 2) {
        pagination += '<div class="pagination__points">...</div>';
      }
      if (learnedPages
        && learnedPages[activeGroup]
        && learnedPages[activeGroup].includes(totalPages.toString())) {
        pagination += `<button class="pagination__btn pagination__btn-learned">${totalPages}</button>`;
      } else {
        pagination += `<button class="pagination__btn">${totalPages}</button>`;
      }
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

  async updateCards(data: Word[]) {
    const checkedWordsArray = await this.checkLearnedWords(data);
    const checkedUserWordsArray = await this.checkUserWords(data);
    const activeTab = document.querySelector('.tabs__block_active');
    const cardsOnPage = Array.from(activeTab.querySelectorAll('.card'));
    cardsOnPage.map((card, index) => {
      if (card.classList.contains('card_learned')) {
        card.classList.remove('card_learned');
      }
      if (checkedWordsArray[index].userLearnedWordsExists === true) {
        card.classList.add('card_learned');
        const dictionaryBtn = card.querySelector('.btn_add');
        dictionaryBtn.classList.add('btn_disable');
        const learnedBtn = card.querySelector('.btn-learned');
        learnedBtn.classList.add('btn_learned');
        learnedBtn.textContent = 'Я не знаю это слово';
      } else {
        const disableBtn = card.querySelector('.btn_add');
        if (disableBtn.classList.contains('btn_disable')) {
          disableBtn.classList.remove('btn_disable');
        }
        const learnedBtn = card.querySelector('.btn-learned');
        learnedBtn.classList.remove('btn_learned');
        learnedBtn.textContent = 'Я знаю это слово';
      }
      if (checkedUserWordsArray[index].id) {
        card.classList.add('card_hard');
        card.querySelector('.btn_add').classList.add('btn_disable');
        card.querySelector('.btn-learned').classList.add('btn_disable');
      } else {
        card.classList.remove('card_hard');
        const disableBtn = card.querySelector('.btn_add');
        const learnedBtn = card.querySelector('.btn-learned');
        disableBtn.classList.remove('btn_disable');
        learnedBtn.classList.remove('btn_disable');
      }
      if (card.classList.contains('card_learned')) {
        card.querySelector('.btn_add').classList.add('btn_disable');
      }
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
        this.playAudio(data[index].audio, data[index].audioExample, data[index].audioMeaning);
      });
      return card;
    });
    this.checkPage();
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

  updateStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  checkStorage(key: string): number {
    const out = localStorage.getItem(key);
    if (out !== null) {
      return Number(out);
    }
    return -1;
  }

  markWordAsLearned(target: HTMLElement) {
    const targetElement = target;
    const api = new Api();
    const userId = localStorage.getItem('userId');
    const cardContainer = targetElement.parentNode.parentNode.parentElement;
    const wordId = cardContainer.id;
    if (targetElement.classList.contains('btn_learned')) {
      targetElement.classList.remove('btn_learned');
      targetElement.parentNode.querySelector('.btn_disable').classList.remove('btn_disable');
      targetElement.textContent = 'Я знаю это слово';
      cardContainer.classList.remove('card_learned');
      api.deleteUserLearnedWordByID(userId, wordId);
    } else {
      targetElement.classList.add('btn_learned');
      cardContainer.classList.add('card_learned');
      targetElement.textContent = 'Я не знаю это слово';
      const addButton = cardContainer.querySelector('.btn_add');
      addButton.classList.add('btn_disable');
      api.updateUserLearnedWords(userId, wordId);
    }
    const tutorialController = new TutorialControllers();
    tutorialController.checkPage();
  }

  addWordToMyDictionary(target: HTMLElement) {
    const targetElement = target;
    const api = new Api();
    const userId = localStorage.getItem('userId');
    const cardContainer = targetElement.parentNode.parentNode.parentElement;
    const wordId = cardContainer.id;
    cardContainer.classList.add('card_hard');
    cardContainer.querySelector('.btn_add').classList.add('btn_disable');
    cardContainer.querySelector('.btn-learned').classList.add('btn_disable');
    api.createUserWord({ difficulty: 'easy', id: userId, wordId });
    const tutorialController = new TutorialControllers();
    tutorialController.checkPage();
  }

  checkLearnedWords(data: Word[]): Promise<CheckLearnedWord[]> {
    const api = new Api();
    const dataValues = Object.values(data);
    const userId = localStorage.getItem('userId');
    const allWordId = dataValues.map((value) => value.id);
    const promisses = allWordId.map(
      (wordId) => new Promise((resolve: (value: Promise<CheckLearnedWord>) => void) => {
        resolve(api.checkLearnWord(userId, wordId));
      }),
    );
    return Promise.all(promisses).then((values) => values);
  }

  checkUserWords(data: Word[]): Promise<UserWord[]> {
    const api = new Api();
    const dataValues = Object.values(data);
    const userId = localStorage.getItem('userId');
    const allWordId = dataValues.map((value) => value.id);
    const promisses = allWordId.map(
      (wordId) => new Promise((resolve: (value: Promise<UserWord>) => void) => {
        resolve(api.getUserWordById(userId, wordId));
      }),
    );
    return Promise.all(promisses).then((values) => values);
  }

  checkPage() {
    const activeTab = document.querySelector('.tabs__block_active');
    const allCardsOnPage = activeTab.querySelectorAll('.card').length;
    const checkedLearnedWordsCounter = activeTab.querySelectorAll('.card_learned').length;
    const checkedHardWordsCounter = activeTab.querySelectorAll('.card_hard').length;
    if (checkedLearnedWordsCounter + checkedHardWordsCounter === allCardsOnPage) {
      activeTab.classList.add('tabs__block-learned');
      const paginationActive = document.querySelector('.pagination__btn_active');
      paginationActive.classList.add('pagination__btn-learned');
      const currentLearnedPagination = localStorage.getItem('pagination');
      const paginationActiveValue = paginationActive.textContent.trim();
      const groupActive = document.querySelector('.tutorial__link_active').getAttribute('data-group');
      if (currentLearnedPagination) {
        const paginationInfo = JSON.parse(currentLearnedPagination);
        // Если такой группы нет то создаём
        if (!paginationInfo[Number(groupActive)]) {
          paginationInfo[groupActive] = [paginationActiveValue];
          localStorage.setItem('pagination', JSON.stringify(paginationInfo));
          // Если группа есть
        } else if (!paginationInfo[Number(groupActive)].includes(paginationActiveValue)) {
          const value = {
            [groupActive]: paginationInfo[Number(groupActive)].concat(paginationActiveValue),
          };
          paginationInfo[groupActive] = value;
          localStorage.setItem('pagination', JSON.stringify(paginationInfo[groupActive]));
        }
      } else {
        const value = { [groupActive]: [paginationActiveValue] };
        localStorage.setItem('pagination', JSON.stringify(value));
      }
    } else if (activeTab.classList.contains('tabs__block-learned')) {
      console.log('here');
      activeTab.classList.remove('tabs__block-learned');
      const groupActive = document.querySelector('.tutorial__link_active').getAttribute('data-group');
      const page: string = document.querySelector('.pagination__btn_active').textContent;
      const paginationData = JSON.parse(localStorage.getItem('pagination'));
      const newArr = paginationData[groupActive];
      if (paginationData[groupActive].indexOf(page) !== -1) {
        paginationData[groupActive] = newArr.splice(paginationData[groupActive].indexOf(page), 1);
        paginationData[groupActive] = newArr;
        localStorage.setItem('pagination', JSON.stringify(paginationData));
      }
      this.createPagination(30, Number(page));
    }
  }
}
