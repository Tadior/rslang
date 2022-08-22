import bell from '../../assets/img/icons/sound.svg';

export default class Card {
  word: string;

  wordTranslation: string;

  wordTranscription: string;

  image: string;

  audio: string;

  sentenceExplaining: string;

  sentenceExplainingTranslation: string;

  sentenceExample: string;

  sentenceExampleTranslation: string;

  constructor(
    word: string,
    wordTranslation: string,
    wordTranscription: string,
    image: string,
    audio: string,
    sentenceExplaining: string,
    sentenceExplainingTranslation: string,
    sentenceExample: string,
    sentenceExampleTranslation: string,
  ) {
    this.word = word;
    this.wordTranslation = wordTranslation;
    this.wordTranscription = wordTranscription;
    this.image = image;
    this.audio = audio;
    this.sentenceExplaining = sentenceExplaining;
    this.sentenceExplainingTranslation = sentenceExplainingTranslation;
    this.sentenceExample = sentenceExample;
    this.sentenceExampleTranslation = sentenceExampleTranslation;
  }

  renderCard() {
    const card = document.createElement('div');
    card.classList.add('card');
    const cardImageFluid = document.createElement('div');
    cardImageFluid.classList.add('card__image-fluid');
    cardImageFluid.innerHTML = `
    <img class="card__img" src="${this.image}" alt="Картинка для слова ${this.word}">
    `;
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card__info');
    const cardName = document.createElement('div');
    cardName.classList.add('card-name');
    cardName.innerHTML = `
        <div class="card-name__original">${this.word}</div>
        <div class="card-name__translation">${this.wordTranslation}</div>
    `;
    const cardTranscription = document.createElement('div');
    cardTranscription.classList.add('card-transcription');
    cardTranscription.textContent = `${this.wordTranscription}`;
    const cardSentences = document.createElement('div');
    cardSentences.classList.add('card-sentences');
    cardSentences.innerHTML = `
    <div class="card-sentence">
        <div class="card-sentence__original">
            ${this.sentenceExplaining}
        </div>
        <div class="card-sentence__translate">
            ${this.sentenceExplainingTranslation}
        </div>
    </div>
    <div class="card-sentence">
        <div class="card-sentence__original">
            ${this.sentenceExample}
        </div>
        <div class="card-sentence__translate">
            ${this.sentenceExampleTranslation}
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
    document.getElementById('tab_01').append(card);
  }
}
