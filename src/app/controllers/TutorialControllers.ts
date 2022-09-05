import {
  Word, UserLearnedWordsCheck, UserWord, User, Progress,
} from '../../types/types';
import Api from '../models/Api';
import Card from '../views/Card';
import AuthorizationControllers from './AuthorizationControllers';
import soundImage from '../../assets/img/icons/sound.svg';
import progressImage from '../../assets/img/icons/progress.svg';
import url from '../models/variables';
import SprintControllers from './SprintControllers';
import StatisticModel from '../models/StatisticModel';
import AudioCallControllers from './AudioCallControllers';

export default class TutorialControllers {
  api: Api;

  userInfo: User;

  userId: string;

  hardWordCallback: (event: Event) => void;

  card: Card;

  userProgress: Progress;

  sprintController: SprintControllers;

  audioController: AudioCallControllers;

  vocabularyInfo: string[];

  statisticModel: StatisticModel;

  constructor() {
    this.api = new Api();
    this.userInfo = new AuthorizationControllers().getUserFromLocalStorage();
    this.userProgress = JSON.parse(localStorage.getItem('progress'));
    this.card = new Card();
    this.sprintController = new SprintControllers();
    this.audioController = new AudioCallControllers();
    this.statisticModel = new StatisticModel();
    this.vocabularyInfo = [];
    this.hardWordCallback = (event: Event) => {
      const target = event.target as HTMLElement;
      this.addWordToMyDictionary(target);
      this.checkPage();
    };
  }

  public enableTutorial(): void {
    this.listenTutorialNavigation();
    this.listenPagination();
    this.listenSprint();
    this.listenAudio();
  }

  private listenTutorialNavigation(): void {
    const tutorialNavigation = document.querySelector('.tutorial__navigation');
    tutorialNavigation.addEventListener('click', (event) => {
      const eventInfo = {
        target: event.target as HTMLElement,
      };

      if (eventInfo.target.hasAttribute('data-group')) {
        const group = eventInfo.target.getAttribute('data-group');
        const prevNav = document.querySelector('.tutorial__link_active');
        const prevNavGroup = prevNav.getAttribute('data-group');
        const prevPaginationValue = document.querySelector('.pagination__btn_active').textContent;
        const pagination = document.querySelector('.pagination');
        if (pagination.classList.contains('pagination_disable')) {
          pagination.classList.remove('pagination_disable');
        }

        if (!this.vocabularyInfo) {
          this.vocabularyInfo[Number(prevNavGroup)] = prevPaginationValue;
          localStorage.setItem('vocabularyInfo', JSON.stringify(this.vocabularyInfo));
          this.vocabularyInfo = JSON.parse(localStorage.getItem('vocabularyInfo'));
        } else {
          this.vocabularyInfo[Number(prevNavGroup)] = prevPaginationValue;
          localStorage.setItem('vocabularyInfo', JSON.stringify(this.vocabularyInfo));
        }
        this.updateStorage(prevNavGroup, prevPaginationValue);

        localStorage.setItem('lastGroup', group);

        const localStoragePage = this.vocabularyInfo[Number(group)];
        if (localStoragePage) {
          this.changeCategory(group, eventInfo.target, String(Number(localStoragePage) - 1));
          if (Number(group) === 6) {
            this.renderVocabulary();
          } else {
            this.createPagination(30, Number(localStoragePage));
          }
        } else {
          this.vocabularyInfo[Number(group)] = '1';
          localStorage.setItem('vocabularyInfo', JSON.stringify(this.vocabularyInfo));
          this.updateStorage(group, '1');
          this.changeCategory(group, eventInfo.target, '0');
          this.createPagination(30, 1);
        }
      }
    });
  }

  private listenPagination(): void {
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

      if (!this.vocabularyInfo) {
        localStorage.setItem('vocabularyInfo', '[]');
      } else {
        this.vocabularyInfo[Number(currentGroup)] = page.toString();
        localStorage.setItem('vocabularyInfo', JSON.stringify(this.vocabularyInfo));
      }
      this.updateStorage(currentGroup, page.toString());

      page -= 1;
      if (page < 0) {
        return false;
      }
      const response = this.api.getWords(currentGroup, page.toString());
      response.then((data) => {
        this.updateCards(data).then(() => this.checkPage());
      });
      return true;
    });
  }

  private listenSprint(): void {
    document.querySelector('#sprint').addEventListener('click', () => {
      const groupValue = document.querySelector('.tutorial__link_active').getAttribute('data-group');
      const page = document.querySelector('.pagination__btn_active').textContent;
      if (groupValue === '6') {
        this.sprintController.startSprintDictionary(this.userInfo.userId);
      } else {
        this.sprintController.startSprintPage(groupValue, `${Number(page) - 1}`);
      }
    });
  }

  private listenAudio(): void {
    document.querySelector('#audio-call').addEventListener('click', () => {
      const groupValue = document.querySelector('.tutorial__link_active').getAttribute('data-group');
      const page = document.querySelector('.pagination__btn_active').textContent;
      if (groupValue === '6') {
        this.audioController.startAudioCallDictionary(this.userInfo.userId);
      } else {
        this.audioController.startAudioCallPage(groupValue, `${Number(page) - 1}`);
      }
    });
  }

  public changeCategory(group: string, target: HTMLElement, page: string): void | boolean {
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

  public renderCards(renderContainer: HTMLElement, cardsValue: number): void {
    for (let i = 0; i < cardsValue; i += 1) {
      const cardContainer = this.card.renderCard(renderContainer);
      if (this.userInfo) {
        const hardBtn = cardContainer.querySelector('.btn_add');
        const learnBtn = cardContainer.querySelector('.btn-learned');
        this.listenCardButtons(hardBtn, learnBtn);
      }
    }
  }

  private listenCardButtons(hardBtn: Element, learnBtn: Element): void {
    hardBtn.addEventListener('click', this.hardWordCallback);
    learnBtn.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      this.markWordAsLearned(target);
    });
  }

  public createPagination(totalPages: number, page: number): boolean | string {
    const activeGroup = document.querySelector('.tutorial__link_active').getAttribute('data-group');
    let learnedPages;
    if (this.userInfo && localStorage.getItem('pagination') !== null) {
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

    if (page === 1) {
      pagination += '<button class="pagination__btn pagination__btn_prev pagination__btn_disabled ">Prev</button>';
    } else if (page > 1) {
      pagination += '<button class="pagination__btn pagination__btn_prev">Prev</button>';
    }

    if (page > 2) {
      if (learnedPages && learnedPages[activeGroup] && learnedPages[activeGroup].includes('1')) {
        pagination += '<button class="pagination__btn pagination__btn-learned">1</button>';
      } else {
        pagination += '<button class="pagination__btn">1</button>';
      }

      if (page > 3) {
        pagination += '<div class="pagination__points">...</div>';
      }
    }

    if (page === totalPages) {
      beforePage -= 2;
    } else if (page === totalPages - 1) {
      beforePage -= 1;
    }

    if (page === 1) {
      afterPage += 2;
    } else if (page === 2) {
      afterPage += 1;
    }

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
      if (learnedPages && learnedPages[activeGroup]
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
      if (learnedPages && learnedPages[activeGroup]
        && learnedPages[activeGroup].includes(totalPages.toString())) {
        pagination += `<button class="pagination__btn pagination__btn-learned">${totalPages}</button>`;
      } else {
        pagination += `<button class="pagination__btn">${totalPages}</button>`;
      }
    }

    if (page === totalPages) {
      pagination += '<button class="pagination__btn pagination__btn_next pagination__btn_disabled">Next</button>';
    } else if (page < totalPages) {
      pagination += '<button class="pagination__btn pagination__btn_next">Next</button>';
    }
    document.querySelector('.pagination').innerHTML = pagination;
    return pagination;
  }

  async updateCards(data: Word[], isVocubulary: boolean = false): Promise<void> {
    let checkedWordsArray: UserLearnedWordsCheck[];
    let checkedUserWordsArray: UserWord[];
    if (!isVocubulary && this.userInfo) {
      checkedWordsArray = await this.checkLearnedWords(data);
      checkedUserWordsArray = await this.checkUserWords(data);
    }
    const activeTab = document.querySelector('.tabs__block_active');
    if (activeTab) {
      const cardsOnPage = Array.from(activeTab.querySelectorAll('.card'));
      cardsOnPage.map((card, index) => {
        if (card.classList.contains('card_learned')) {
          card.classList.remove('card_learned');
        }
        if (this.userInfo && !isVocubulary && checkedWordsArray[index]
          && checkedWordsArray[index].userLearnedWordsExists) {
          card.classList.add('card_learned');
          const dictionaryBtn = card.querySelector('.btn_add');
          dictionaryBtn.classList.add('btn_disable');
          const learnedBtn = card.querySelector('.btn-learned');
          learnedBtn.classList.add('btn_learned');
          learnedBtn.textContent = 'Я не знаю это слово';
        } else if (this.userInfo) {
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
              const wordId = card.id;
              this.api.deleteUserWordById(this.userInfo.userId, wordId);
              const message = document.querySelector('.tabs__block_message');
              card.remove();
              const cards = Array.from(activeTab.querySelectorAll('.card'));
              if (message && cards.length === 0) {
                message.classList.remove('tabs__block_none');
              }
            });
          }
        }
        if (this.userInfo && !isVocubulary && checkedUserWordsArray[index]
            && checkedUserWordsArray[index].id) {
          card.classList.add('card_hard');
          card.querySelector('.btn_add').classList.add('btn_disable');
          card.querySelector('.btn-learned').classList.add('btn_disable');
        } else if (this.userInfo) {
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
        if (this.userInfo && this.userProgress) {
          this.setProgress(cardItem, cardItem.id);
        }
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
  }

  private setProgress(cardContainer: Element, cardId: string): void {
    const progressWrapper = cardContainer.querySelector('.card__progress-values');
    const progressTitle = cardContainer.querySelector('.card__progress-title');
    let progressInner = '';
    const progressKeys = Object.keys(this.userProgress);
    for (let i = 0; i < progressKeys.length; i += 1) {
      const progressLength = this.userProgress[progressKeys[i]].length;
      if (progressKeys[i] === cardId && progressTitle.classList.contains('card__progress-title_none') && progressLength > 0) {
        progressTitle.classList.remove('card__progress-title_none');
      }
      if (progressKeys[i] === cardId) {
        for (let j = 0; j < progressLength; j += 1) {
          progressInner += `<img class = 'card__progress-image' src = '${progressImage}'>`;
        }
      }
    }
    progressWrapper.innerHTML = progressInner;
  }

  private playAudio(wordPath: string, wordMeaningPath: string, wordExamplePath: string): void {
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

  public updateStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public checkStorage(key: string): number {
    const out = localStorage.getItem(key);
    if (out !== null) {
      return Number(out);
    }
    return -1;
  }

  private markWordAsLearned(target: HTMLElement): void {
    const targetElement = target;
    const cardContainer = targetElement.parentNode.parentNode.parentElement;
    const wordId = cardContainer.id;
    if (targetElement.classList.contains('btn_learned')) {
      targetElement.classList.remove('btn_learned');
      targetElement.parentNode.querySelector('.btn_disable').classList.remove('btn_disable');
      targetElement.textContent = 'Я знаю это слово';
      cardContainer.classList.remove('card_learned');
      this.statisticModel.deleteWordFromLearned(this.userInfo.userId);
      this.api.deleteUserLearnedWordById(this.userInfo.userId, wordId);
    } else {
      targetElement.classList.add('btn_learned');
      cardContainer.classList.add('card_learned');
      targetElement.textContent = 'Я не знаю это слово';
      const addButton = cardContainer.querySelector('.btn_add');
      addButton.classList.add('btn_disable');
      cardContainer.querySelector('.card__progress-title').classList.add('card__progress-title_none');
      cardContainer.querySelector('.card__progress-values').innerHTML = '';
      this.statisticModel.addWordToLearned(this.userInfo.userId);
      this.api.updateUserLearnedWords(this.userInfo.userId, wordId);
      this.updateWordProgress(wordId);
    }
    const tutorialController = new TutorialControllers();
    tutorialController.checkPage();
  }

  private updateWordProgress(wordId: string): void {
    if (this.userProgress[wordId]) {
      this.userProgress[wordId] = [];
    }
    localStorage.setItem('progress', JSON.stringify(this.userProgress));
  }

  private addWordToMyDictionary(target: HTMLElement): void {
    const targetElement = target;
    const cardContainer = targetElement.parentNode.parentNode.parentElement;
    const wordId = cardContainer.id;
    cardContainer.classList.add('card_hard');
    cardContainer.querySelector('.btn_add').classList.add('btn_disable');
    cardContainer.querySelector('.btn-learned').classList.add('btn_disable');
    const response = this.api.createUserWord({ difficulty: 'easy', id: this.userInfo.userId, wordId });
    response.then(() => this.checkPage());
  }

  private checkLearnedWords(data: Word[]): Promise<UserLearnedWordsCheck[]> {
    const dataValues = Object.values(data);
    const allWordId = dataValues.map((value) => value.id);
    const promisses = allWordId.map(
      (wordId) => new Promise((resolve: (value: Promise<UserLearnedWordsCheck>) => void) => {
        resolve(
          this.api.isWordLearned(this.userInfo.userId, wordId),
        );
      }),
    );
    return Promise.all(promisses).then((values) => values);
  }

  private checkUserWords(data: Word[]): Promise<UserWord[]> {
    const dataValues = Object.values(data);
    const allWordId = dataValues.map((value) => value.id);
    const promisses = allWordId.map(
      (wordId) => new Promise((resolve: (value: Promise<UserWord>) => void) => {
        resolve(
          this.api.getUserWordById(this.userInfo.userId, wordId),
        );
      }),
    );
    return Promise.all(promisses).then((values) => values);
  }

  private toggleGamesButtons(status: boolean): void {
    const games = document.querySelectorAll('.tutorial-game');
    if (status) {
      games.forEach((button) => button.classList.add('tutorial-game_disabled'));
    } else {
      games.forEach((button) => button.classList.remove('tutorial-game_disabled'));
    }
  }

  public checkPage(): void {
    const activeTab = document.querySelector('.tabs__block_active');
    if (activeTab) {
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

          if (!paginationInfo[Number(groupActive)]) {
            paginationInfo[groupActive] = [paginationActiveValue];
            localStorage.setItem('pagination', JSON.stringify(paginationInfo));
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
  }

  public renderVocabulary(): void {
    const pagination = document.querySelector('.pagination');
    if (!pagination.classList.contains('pagination_disable')) {
      pagination.classList.add('pagination_disable');
    }
    const buttonsDisabled = document.querySelectorAll('.tutorial-game_disabled');
    if (buttonsDisabled) {
      buttonsDisabled.forEach((button) => button.classList.remove('tutorial-game_disabled'));
    }

    const response = this.api.getUserWords(this.userInfo.userId);
    const vocabularyTab = document.getElementById('tab_6');
    const messageItem = vocabularyTab.querySelector('.tabs__block_message');
    response.then(async (data) => {
      const cards = vocabularyTab.querySelectorAll('.card');
      const wordsId = data.map((word) => word.wordId);
      const allWords = await Promise.all(wordsId.map((wordId) => this.api.getWordById(wordId)));
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
