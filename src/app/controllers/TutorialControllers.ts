import { Word, UserLearnedWordsCheck, UserWord } from '../../types/types';
import Api from '../models/Api';
import Card from '../views/Card';
import soundImage from '../../assets/img/icons/sound.svg';
import url from '../models/variables';

export default class TutorialControllers {
  api: Api;

  hardWordCallback: (event: Event) => void;

  constructor() {
    this.api = new Api();
    this.hardWordCallback = (event: Event) => {
      const target = event.target as HTMLElement;
      this.addWordToMyDictionary(target);
      this.checkPage();
    };
  }

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
        const pagination = document.querySelector('.pagination');
        if (pagination.classList.contains('pagination_disable')) {
          pagination.classList.remove('pagination_disable');
        }
        // Обновляем значение предыдущей категории
        this.updateStorage(prevNavGroup, prevPaginationValue);
        // Обновляем текущую категорию
        this.updateStorage('lastNav', group);
        // Если в local storage есть страница на которой пользователь остановился - загрузить эту страницу
        const localStoragePage = this.checkStorage(group);
        if (localStoragePage !== -1) {
          this.changeCategory(group, eventInfo.target, String(localStoragePage - 1));
          if (Number(group) === 6) {
            this.renderVocabulary();
          } else {
            this.createPagination(30, localStoragePage);
          }
        } else {
          this.updateStorage(group, '1');
          this.changeCategory(group, eventInfo.target, '0');
          this.createPagination(30, 1);
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
        this.updateCards(data).then(() => this.checkPage());
      });
      return true;
    });
  }

  changeCategory(group: string, target: HTMLElement, page: string): void | boolean {
    const prevNavActive = document.querySelector('.tutorial__link_active');
    if (prevNavActive) {
      prevNavActive.classList.remove('tutorial__link_active');
    }
    const prevTabActive = document.querySelector('.tabs__block_active');
    prevTabActive.classList.remove('tabs__block_active');
    const groupValue = group.toString();

    const targetItem = target;
    targetItem.classList.add('tutorial__link_active');

    const tabActive = document.getElementById(`tab_${group}`);
    tabActive.classList.add('tabs__block_active');

    const categoryWrapper = document.getElementById(`tab_${group}`);

    if (categoryWrapper.querySelector('.card')) {
      const response = this.api.getWords(`${groupValue}`, page);
      response.then((data) => {
        if (data.length === 0) {
          return false;
        }
        this.updateCards(data).then(() => this.checkPage());
        return true;
      });
      return false;
    }

    const response = this.api.getWords(`${groupValue}`, page);
    response.then((data) => {
      this.renderCards(categoryWrapper, data.length);
      this.updateCards(data).then(() => {
        if (data.length === 0) {
          return false;
        }
        if (group !== '6') {
          this.checkPage();
        }
        return true;
      });
    });
    return true;
  }

  renderCards(renderContainer: HTMLElement, cardsValue: number) {
    for (let i = 0; i < cardsValue; i += 1) {
      const card = new Card();
      const cardContainer = card.renderCard(renderContainer);
      const hardBtn = cardContainer.querySelector('.btn_add');
      const learnBtn = cardContainer.querySelector('.btn-learned');

      hardBtn.addEventListener('click', this.hardWordCallback);

      learnBtn.addEventListener('click', (event: Event) => {
        const target = event.target as HTMLElement;
        this.markWordAsLearned(target);
      });
    }
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

  async updateCards(data: Word[], isVocubulary: boolean = false) {
    let checkedWordsArray: UserLearnedWordsCheck[];
    let checkedUserWordsArray: UserWord[];
    if (!isVocubulary) {
      checkedWordsArray = await this.checkLearnedWords(data);
      checkedUserWordsArray = await this.checkUserWords(data);
    }
    const activeTab = document.querySelector('.tabs__block_active');
    const cardsOnPage = Array.from(activeTab.querySelectorAll('.card'));
    cardsOnPage.map((card, index) => {
      if (card.classList.contains('card_learned')) {
        card.classList.remove('card_learned');
      }
      if (!isVocubulary
        && checkedWordsArray[index] && checkedWordsArray[index].userLearnedWordsExists) {
        card.classList.add('card_learned');
        const dictionaryBtn = card.querySelector('.btn_add');
        dictionaryBtn.classList.add('btn_disable');
        const learnedBtn = card.querySelector('.btn-learned');
        learnedBtn.classList.add('btn_learned');
        learnedBtn.textContent = 'Я не знаю это слово';
      } else {
        const addBtn = card.querySelector('.btn_add');
        if (addBtn.classList.contains('btn_disable')) {
          addBtn.classList.remove('btn_disable');
        }
        const learnedBtn = card.querySelector('.btn-learned');
        if (!isVocubulary) {
          learnedBtn.classList.remove('btn_learned');
          learnedBtn.textContent = 'Я знаю это слово';
        } else {
          addBtn.textContent = 'Удалить из словаря';
          learnedBtn.classList.add('btn_none');
          addBtn.removeEventListener('click', this.hardWordCallback);
          addBtn.addEventListener('click', () => {
            const userId = localStorage.getItem('userId');
            const wordId = card.id;
            this.api.deleteUserWordById(userId, wordId);
            const message = document.querySelector('.tabs__block_message');
            card.remove();
            const cards = Array.from(activeTab.querySelectorAll('.card'));
            if (message && cards.length === 0) {
              message.classList.remove('tabs__block_none');
            }
          });
        }
      }
      if (!isVocubulary && checkedUserWordsArray[index] && checkedUserWordsArray[index].id) {
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
      api.deleteUserLearnedWordById(userId, wordId);
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
    const userId = localStorage.getItem('userId');
    const cardContainer = targetElement.parentNode.parentNode.parentElement;
    const wordId = cardContainer.id;
    cardContainer.classList.add('card_hard');
    cardContainer.querySelector('.btn_add').classList.add('btn_disable');
    cardContainer.querySelector('.btn-learned').classList.add('btn_disable');
    const response = this.api.createUserWord({ difficulty: 'easy', id: userId, wordId });
    response.then(() => this.checkPage());
  }

  checkLearnedWords(data: Word[]): Promise<UserLearnedWordsCheck[]> {
    const api = new Api();
    const dataValues = Object.values(data);
    const userId = localStorage.getItem('userId');
    const allWordId = dataValues.map((value) => value.id);
    const promisses = allWordId.map(
      (wordId) => new Promise((resolve: (value: Promise<UserLearnedWordsCheck>) => void) => {
        resolve(api.isWordLearned(userId, wordId));
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

  toggleGamesButtons(status: boolean): void {
    const games = document.querySelectorAll('.tutorial-game');
    if (status) {
      games.forEach((button) => button.classList.add('tutorial-game_disabled'));
    } else {
      games.forEach((button) => button.classList.remove('tutorial-game_disabled'));
    }
  }

  checkPage() {
    const activeTab = document.querySelector('.tabs__block_active');
    const allCardsOnPage = activeTab.querySelectorAll('.card').length;
    const checkedLearnedWordsCounter = activeTab.querySelectorAll('.card_learned').length;
    const checkedHardWordsCounter = activeTab.querySelectorAll('.card_hard').length;
    if (checkedLearnedWordsCounter + checkedHardWordsCounter === allCardsOnPage) {
      this.toggleGamesButtons(true);
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
      this.toggleGamesButtons(false);
    } else {
      this.toggleGamesButtons(false);
    }
  }

  renderVocabulary() {
    const pagination = document.querySelector('.pagination');
    if (!pagination.classList.contains('pagination_disable')) {
      pagination.classList.add('pagination_disable');
    }
    const buttonsDisabled = document.querySelectorAll('.tutorial-game_disabled');
    if (buttonsDisabled) {
      buttonsDisabled.forEach((button) => button.classList.remove('tutorial-game_disabled'));
    }
    const userId = localStorage.getItem('userId');
    const response = this.api.getUserWords(userId);
    const vocabularyTab = document.getElementById('tab_6');
    const messageItem = vocabularyTab.querySelector('.tabs__block_message');
    response.then(async (data) => {
      const cards = vocabularyTab.querySelectorAll('.card');
      const wordsId = data.map((word) => word.wordId);
      const allWords = await Promise.all(
        wordsId.map((wordId) => this.api.getWordById(wordId)),
      );
      if (data.length === 0) {
        messageItem.classList.remove('tabs__block_none');
      } else {
        messageItem.classList.add('tabs__block_none');
      }

      if (cards.length <= data.length) {
        const gap = data.length - cards.length;
        this.renderCards(vocabularyTab, gap);
      } else {
        for (let i = cards.length; i > data.length; i -= 1) {
          cards[i].remove();
        }
      }
      this.updateCards(allWords, true);
    });
  }
}
