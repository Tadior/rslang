import { User } from '../../types/types';
import bell from '../../assets/img/icons/sound.svg';
import AuthorizationControllers from '../controllers/AuthorizationControllers';

export default class Card {
  userInfo: User;

  userId: string;

  constructor() {
    this.userInfo = new AuthorizationControllers().getUserFromLocalStorage();
  }

  public renderCard(positionToPlace: HTMLElement): HTMLDivElement {
    const card = document.createElement('div');
    card.classList.add('card');
    const cardFluid = document.createElement('div');
    cardFluid.classList.add('card__fluid');
    const cardProgress = document.createElement('div');
    cardProgress.classList.add('card__progress');
    const cardProgressTitle = document.createElement('div');
    cardProgressTitle.classList.add('card__progress-title', 'card__progress-title_none');
    cardProgressTitle.textContent = 'Прогресс изучения';
    const cardProgressValues = document.createElement('div');
    cardProgressValues.classList.add('card__progress-values');
    const cardImageFluid = document.createElement('div');
    cardImageFluid.classList.add('card__image-fluid');
    cardImageFluid.innerHTML = `
    <img class="card__img" src="" alt="Картинка для слова">
    `;
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card__info');
    const cardName = document.createElement('div');
    cardName.classList.add('card-name');
    cardName.innerHTML = `
        <div class="card-name__original"></div>
        <div class="card-name__translation"></div>
    `;
    const cardTranscription = document.createElement('div');
    cardTranscription.classList.add('card-transcription');
    const cardSentences = document.createElement('div');
    cardSentences.classList.add('card-sentences');
    cardSentences.innerHTML = `
    <div class="card-sentence card-sentence_example">
        <div class="card-sentence__original">

        </div>
        <div class="card-sentence__translate">

        </div>
    </div>
    <div class="card-sentence card-sentence_meaning">
        <div class="card-sentence__original">

        </div>
        <div class="card-sentence__translate">

        </div>
    </div>
    `;
    const cardButtons = document.createElement('div');
    cardButtons.classList.add('card-sentence__buttons');
    const buttonAudio = document.createElement('button');
    buttonAudio.classList.add('card-btn__audio');
    buttonAudio.innerHTML = `
        <img src="${bell}" alt="Произнести слово">
    `;
    if (this.userInfo) {
      const buttonDictionary = document.createElement('button');
      buttonDictionary.classList.add('btn', 'btn_bordered', 'btn_card', 'btn_bold', 'btn_add');
      buttonDictionary.textContent = 'Добавить в словарь';
      const buttonLearned = document.createElement('button');
      buttonLearned.classList.add('btn', 'btn_card', 'btn-learned');
      buttonLearned.textContent = 'Я знаю это слово';
      cardButtons.append(buttonDictionary, buttonLearned);
    }
    cardInfo.append(cardName, cardTranscription, cardSentences, cardButtons, buttonAudio);
    cardProgress.append(cardProgressTitle, cardProgressValues);
    cardFluid.append(cardImageFluid, cardProgress);
    card.append(cardFluid, cardInfo);
    positionToPlace.append(card);
    return card;
  }
}
