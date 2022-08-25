import bell from '../../assets/img/icons/sound.svg';
import { Word } from '../../types/types';
import url from '../models/variables';

export default class Card implements Word {
  id: string;

  group: number;

  page: number;

  word: string;

  image: string;

  audio: string;

  audioMeaning: string;

  audioExample: string;

  textMeaning: string;

  textExample: string;

  transcription: string;

  wordTranslate: string;

  textMeaningTranslate: string;

  textExampleTranslate: string;

  constructor(
    wordObject: Word,
  ) {
    this.word = wordObject.word;
    this.wordTranslate = wordObject.wordTranslate;
    this.transcription = wordObject.transcription;
    this.image = wordObject.image;
    this.audio = wordObject.audio;
    this.audioMeaning = wordObject.audioMeaning;
    this.audioExample = wordObject.audioExample;
    this.textMeaning = wordObject.textMeaning;
    this.textMeaningTranslate = wordObject.textMeaningTranslate;
    this.textExample = wordObject.textExample;
    this.textExampleTranslate = wordObject.textExampleTranslate;
  }

  renderCard(positionToPlace: HTMLElement) {
    const card = document.createElement('div');
    card.classList.add('card');
    const cardImageFluid = document.createElement('div');
    cardImageFluid.classList.add('card__image-fluid');
    cardImageFluid.innerHTML = `
    <img class="card__img" src="${url}${this.image}" alt="Картинка для слова ${this.word}">
    `;
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card__info');
    const cardName = document.createElement('div');
    cardName.classList.add('card-name');
    cardName.innerHTML = `
        <div class="card-name__original">${this.word}</div>
        <div class="card-name__translation">${this.wordTranslate}</div>
    `;
    const cardTranscription = document.createElement('div');
    cardTranscription.classList.add('card-transcription');
    cardTranscription.textContent = `${this.transcription}`;
    const cardSentences = document.createElement('div');
    cardSentences.classList.add('card-sentences');
    cardSentences.innerHTML = `
    <div class="card-sentence">
        <div class="card-sentence__original">
            ${this.textMeaning}
        </div>
        <div class="card-sentence__translate">
            ${this.textMeaningTranslate}
        </div>
    </div>
    <div class="card-sentence">
        <div class="card-sentence__original">
            ${this.textExample}
        </div>
        <div class="card-sentence__translate">
            ${this.textExampleTranslate}
        </div>
    </div>
    `;
    const cardButtons = document.createElement('div');
    cardButtons.classList.add('card-sentence__buttons');
    const buttonLearn = document.createElement('button');
    buttonLearn.classList.add('btn', 'btn_bordered', 'btn_card', 'btn_bold');
    buttonLearn.textContent = 'Учить';
    const buttonRemove = document.createElement('button');
    buttonRemove.classList.add('btn', 'btn_card');
    buttonRemove.textContent = 'Удалить';
    const buttonAudio = document.createElement('button');
    buttonAudio.classList.add('card-btn__audio');
    buttonAudio.innerHTML = `
        <img src="${bell}" alt="Произнести слово ${this.word}">
    `;
    cardButtons.append(buttonLearn, buttonRemove);
    cardInfo.append(cardName, cardTranscription, cardSentences, cardButtons, buttonAudio);
    card.append(cardImageFluid, cardInfo);
    positionToPlace.append(card);
    buttonAudio.addEventListener('click', () => {
      const audioWord = new Audio(url + this.audio);
      audioWord.addEventListener('ended', () => {
        const audioMeaning = new Audio(url + this.audioMeaning);
        audioMeaning.play();
        audioMeaning.addEventListener('ended', () => {
          const audioExample = new Audio(url + this.audioExample);
          audioExample.play();
        });
      });
      audioWord.play();
    });
  }
}
